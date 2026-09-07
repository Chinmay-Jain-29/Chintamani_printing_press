import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { verifyRequestOrigin, getSafeErrorMessage } from '@/lib/security';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);

function validateMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  if (ext === '.jpg' || ext === '.jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (ext === '.png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (ext === '.webp') {
    const isRiff =
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    const isWebp =
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
    return isRiff && isWebp;
  }

  if (ext === '.svg') {
    const text = buffer.toString('utf-8').toLowerCase();
    // Must look like an SVG document
    if (!text.includes('<svg')) return false;

    // Reject SVGs containing script tags, embedded objects, or active inline event handlers
    const dangerousPatterns = [
      /<script[\s>]/i,
      /<\/script>/i,
      /<iframe[\s>]/i,
      /<object[\s>]/i,
      /<embed[\s>]/i,
      /<foreignobject[\s>]/i,
      /\bon[a-z]+\s*=/i, // onload=, onerror=, onclick=
      /javascript:/i,
      /data:text\/html/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(text)) {
        console.warn('[SECURITY WARNING] Blocked malicious SVG upload containing active scripts or event handlers.');
        return false;
      }
    }
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!verifyRequestOrigin(req)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(`upload_${session.userId}_${ip}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Upload rate limit exceeded. Please wait a few minutes.' }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds the 5MB limit. (Uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, and SVG image files are allowed.' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Invalid file extension. Allowed: .jpg, .jpeg, .png, .webp, .svg' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!validateMagicBytes(buffer, ext)) {
      return NextResponse.json(
        { error: 'File content does not match the expected image signature or contains unsafe content.' },
        { status: 400 }
      );
    }

    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'upload';
    const randomHex = crypto.randomBytes(6).toString('hex');
    const safeFilename = `${cleanBase}-${Date.now()}-${randomHex}${ext}`;

    // 1. If Supabase is configured, upload to Supabase Storage bucket for permanent cloud hosting
    const supabaseAdmin = getSupabaseAdmin();
    if (supabaseAdmin) {
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'chintamani_uploads';

      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(safeFilename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(safeFilename);

        console.log(`[AUDIT] Uploaded to Supabase Storage bucket "${bucketName}": ${safeFilename}`);
        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          filename: safeFilename,
        });
      }

      console.warn('[STORAGE] Supabase storage upload returned error, attempting local fallback:', uploadError.message);
    }

    // 2. Local filesystem fallback (for local development or when Supabase Storage is not yet configured)
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destinationPath = path.resolve(uploadsDir, safeFilename);

    // Verify path stays strictly within uploads directory (path traversal defense)
    if (!destinationPath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Invalid destination path.' }, { status: 400 });
    }

    fs.writeFileSync(destinationPath, buffer);

    console.log(`[AUDIT] Admin uploaded file locally: ${safeFilename} (${(file.size / 1024).toFixed(1)} KB)`);

    const publicUrl = `/uploads/${safeFilename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename: safeFilename });
  } catch (error: unknown) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: getSafeErrorMessage(error, 'File upload failed.') }, { status: 500 });
  }
}
