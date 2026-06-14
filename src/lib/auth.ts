const ALGORITHM = 'PBKDF2';
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'SHA-256';
const EXPIRY = 7 * 24 * 60 * 60;

export const SESSION_COOKIE = 'session_token';

export interface SessionPayload {
  userId: string;
  tenantId: string;
  email: string;
  name: string;
  role: 'OWNER' | 'CASHIER';
}

// ── Password Hashing ────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const saltBuf = new ArrayBuffer(16);
  crypto.getRandomValues(new Uint8Array(saltBuf));
  const salt = new Uint8Array(saltBuf);
  const saltHex = bufToHex(salt);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: ALGORITHM }, false, ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: ALGORITHM, salt, iterations: ITERATIONS, hash: DIGEST },
    keyMaterial, KEY_LENGTH * 8
  );

  return `${saltHex}:${bufToHex(new Uint8Array(derivedBits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  const salt = hexToBuf(saltHex);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), { name: ALGORITHM }, false, ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: ALGORITHM, salt, iterations: ITERATIONS, hash: DIGEST },
    keyMaterial, KEY_LENGTH * 8
  );

  return bufToHex(new Uint8Array(derivedBits)) === hashHex;
}

// ── JWT Session ─────────────────────────────────────────

export async function createSession(payload: SessionPayload, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + EXPIRY };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedClaims = btoa(JSON.stringify(claims)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${encodedHeader}.${encodedClaims}`));

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${encodedHeader}.${encodedClaims}.${encodedSignature}`;
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedClaims, encodedSignature] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    const signatureBytes = Uint8Array.from(
      atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    const valid = await crypto.subtle.verify(
      'HMAC', key, signatureBytes, encoder.encode(`${encodedHeader}.${encodedClaims}`)
    );

    if (!valid) return null;

    const claims = JSON.parse(atob(encodedClaims.replace(/-/g, '+').replace(/_/g, '/')));
    if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      userId: claims.userId,
      tenantId: claims.tenantId,
      email: claims.email,
      name: claims.name,
      role: claims.role,
    };
  } catch {
    return null;
  }
}

// ── Helpers ─────────────────────────────────────────────

function bufToHex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex: string): Uint8Array<ArrayBuffer> {
  const raw = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    raw[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  const buf = new ArrayBuffer(raw.length);
  new Uint8Array(buf).set(raw);
  return new Uint8Array(buf);
}
