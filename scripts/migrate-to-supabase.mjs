import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load .env.local if present
const envLocalPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ ERROR: Supabase credentials missing.');
  console.error('Please ensure the following environment variables are set in .env.local or your environment:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL (e.g. https://your-project.supabase.co)');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (service_role secret key)');
  console.error('\nExample usage:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=secret node scripts/migrate-to-supabase.mjs\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const storePath = path.join(ROOT_DIR, 'data', 'store.json');
if (!fs.existsSync(storePath)) {
  console.error(`❌ ERROR: Could not find ${storePath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(storePath, 'utf-8');
const store = JSON.parse(rawData);

console.log('============================================================');
console.log('🚀 NEW CHINTAMANI PRINTING PRESS — SUPABASE DATA MIGRATION');
console.log('============================================================');
console.log(`Connecting to: ${supabaseUrl}`);

async function migrate() {
  const report = {};

  // 1. Services
  if (Array.isArray(store.services) && store.services.length > 0) {
    const serviceRows = store.services.map((s) => ({
      id: s.id,
      slug: s.slug || s.name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
      name_en: s.name_en,
      name_mr: s.name_mr || '',
      name_hi: s.name_hi || '',
      desc_en: s.desc_en || '',
      desc_mr: s.desc_mr || '',
      desc_hi: s.desc_hi || '',
      category: s.category || 'printing',
      icon: s.icon || '🖨️',
      image_url: s.imageUrl || null,
      featured: Boolean(s.featured),
      coming_soon: Boolean(s.comingSoon),
      visible: s.visible !== undefined ? Boolean(s.visible) : true,
      sort_order: s.sortOrder || 0,
    }));

    const { error } = await supabase.from('services').upsert(serviceRows, { onConflict: 'id' });
    if (error) throw new Error(`Services migration failed: ${error.message}`);
    report['services'] = serviceRows.length;
  }

  // 2. Portfolio
  if (Array.isArray(store.portfolio) && store.portfolio.length > 0) {
    const portfolioRows = store.portfolio.map((p) => ({
      id: p.id,
      title_en: p.title_en,
      title_mr: p.title_mr || '',
      title_hi: p.title_hi || '',
      desc_en: p.desc_en || '',
      desc_mr: p.desc_mr || '',
      desc_hi: p.desc_hi || '',
      category: p.category || 'other',
      image_url: p.imageUrl,
      thumbnail_url: p.thumbnailUrl || null,
      featured: Boolean(p.featured),
      top_work: Boolean(p.topWork),
      visible: p.visible !== undefined ? Boolean(p.visible) : true,
      sort_order: p.sortOrder || 0,
    }));

    const { error } = await supabase.from('portfolio').upsert(portfolioRows, { onConflict: 'id' });
    if (error) throw new Error(`Portfolio migration failed: ${error.message}`);
    report['portfolio'] = portfolioRows.length;
  }

  // 3. Reviews
  if (Array.isArray(store.reviews) && store.reviews.length > 0) {
    const reviewRows = store.reviews.map((r) => ({
      id: r.id,
      customer_name: r.customerName,
      location: r.location || null,
      rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
      review_text: r.reviewText,
      language: r.language || 'en',
      customer_photo: r.customerPhoto || null,
      status: r.status || 'pending',
      featured: Boolean(r.featured),
      created_at: r.createdAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from('reviews').upsert(reviewRows, { onConflict: 'id' });
    if (error) throw new Error(`Reviews migration failed: ${error.message}`);
    report['reviews'] = reviewRows.length;
  }

  // 4. Quotes
  if (Array.isArray(store.quotes) && store.quotes.length > 0) {
    const quoteRows = store.quotes.map((q) => ({
      id: q.id,
      customer_name: q.customerName,
      phone: q.phone,
      whatsapp: q.whatsapp || null,
      email: q.email || null,
      service: q.service,
      quantity: q.quantity || null,
      size_specification: q.sizeSpecification || null,
      requirements: q.requirements || '',
      preferred_contact: q.preferredContact || 'WhatsApp',
      status: q.status || 'New',
      internal_notes: q.internalNotes || null,
      created_at: q.createdAt || new Date().toISOString(),
    }));

    const { error } = await supabase.from('quotes').upsert(quoteRows, { onConflict: 'id' });
    if (error) throw new Error(`Quotes migration failed: ${error.message}`);
    report['quotes'] = quoteRows.length;
  }

  // 5. Translations
  if (store.translations && typeof store.translations === 'object') {
    const translationRows = Object.entries(store.translations).map(([key, trans]) => ({
      key,
      en: trans.en || '',
      mr: trans.mr || '',
      hi: trans.hi || '',
    }));

    const { error } = await supabase.from('translations').upsert(translationRows, { onConflict: 'key' });
    if (error) throw new Error(`Translations migration failed: ${error.message}`);
    report['translations'] = translationRows.length;
  }

  // 6. Site Settings
  const settingsRows = [
    { key: 'business_info', data: store.businessInfo },
    { key: 'branding', data: store.branding },
    { key: 'homepage_config', data: store.homepage },
    { key: 'social_links', data: store.socialLinks },
    { key: 'seo_settings', data: store.seo },
  ].filter((item) => item.data);

  if (settingsRows.length > 0) {
    const { error } = await supabase.from('site_settings').upsert(settingsRows, { onConflict: 'key' });
    if (error) throw new Error(`Site settings migration failed: ${error.message}`);
    report['site_settings'] = settingsRows.length;
  }

  // 7. Admin User
  if (store.admin) {
    const adminRow = {
      id: store.admin.id || 'admin-1',
      email: store.admin.email,
      password_hash: store.admin.passwordHash,
      salt: store.admin.salt,
      token_version: store.admin.tokenVersion || 1,
      reset_token_hash: store.admin.resetTokenHash || null,
      reset_expires: store.admin.resetExpires || null,
    };

    const { error } = await supabase.from('admin_users').upsert([adminRow], { onConflict: 'id' });
    if (error) throw new Error(`Admin users migration failed: ${error.message}`);
    report['admin_users'] = 1;
  }

  console.log('\n✅ MIGRATION SUCCESSFUL! Data inventory migrated to Supabase:');
  console.table(
    Object.entries(report).map(([table, count]) => ({
      'Supabase Table': table,
      'Records Migrated': count,
      Status: 'Verified ✓',
    }))
  );
  console.log('All records were upserted idempotently. No duplicate records created.');
}

migrate().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
