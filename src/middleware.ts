import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'admin_session_token';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'chintamani-printing-press-secret-key-1999-secure';

/**
 * Validates JWT token using Web Crypto API compatible with Next.js Edge Runtime.
 */
async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [header, body, signature] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(SESSION_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const base64UrlToUint8Array = (base64url: string): Uint8Array => {
      let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    };

    const signatureBytes = base64UrlToUint8Array(signature);
    const dataBytes = enc.encode(`${header}.${body}`);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      dataBytes as unknown as BufferSource
    );

    if (!isValid) return false;

    const payloadStr = atob(body.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedAdminPage =
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    pathname !== '/admin/forgot-password' &&
    pathname !== '/admin/reset-password';

  const isProtectedAdminApi = pathname.startsWith('/api/admin');

  if (isProtectedAdminPage || isProtectedAdminApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const isAuthenticated = token ? await verifyTokenEdge(token) : false;

    if (!isAuthenticated) {
      if (isProtectedAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
