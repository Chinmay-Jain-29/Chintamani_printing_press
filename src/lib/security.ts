/**
 * Security utilities: input validation, sanitization, XSS prevention, and CSRF Origin verification.
 */

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escapes characters that could be interpreted as HTML markup.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (s) => HTML_ENTITIES[s] || s);
}

/**
 * Sanitizes and enforces maximum length on text input.
 */
export function sanitizeText(str: unknown, maxLength = 1000): string {
  if (typeof str !== 'string') return '';
  const trimmed = str.trim();
  const capped = trimmed.length > maxLength ? trimmed.substring(0, maxLength) : trimmed;
  return escapeHtml(capped);
}

/**
 * Validates email format using RFC 5322 standard pattern.
 */
export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Validates phone number format (allows international digits, +, hyphens, spaces).
 */
export function isValidPhone(phone: unknown): boolean {
  if (typeof phone !== 'string') return false;
  const trimmed = phone.trim();
  if (trimmed.length < 7 || trimmed.length > 20) return false;
  const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(trimmed);
}

/**
 * Validates that a URL does not use dangerous protocols like javascript: or data:
 * Only allows http:, https:, mailto:, tel:, or relative paths starting with /
 */
export function isValidSafeUrl(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  const trimmed = url.trim();

  // Allow relative URLs
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Serializes an object to JSON safe for embedding inside an HTML <script> tag.
 * Replaces <, >, and & with Unicode escapes to prevent script breakout injection.
 */
export function safeJsonLdStringify(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/**
 * Validates that an incoming state-changing request matches the origin/host.
 */
export function verifyRequestOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  // If no origin (e.g. same-origin GET/direct or tools), check referer
  if (!origin) {
    const referer = req.headers.get('referer');
    if (!referer) {
      // In production, require either origin or referer for state mutations
      return process.env.NODE_ENV !== 'production';
    }
    try {
      const refererUrl = new URL(referer);
      return host ? refererUrl.host === host : true;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return host ? originUrl.host === host : true;
  } catch {
    return false;
  }
}

/**
 * Safe error message formatter for API responses to prevent stack/internal leaks.
 */
export function getSafeErrorMessage(error: unknown, fallback = 'An error occurred while processing your request.'): string {
  if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
}
