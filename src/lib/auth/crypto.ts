const ALGORITHM = 'PBKDF2';
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'SHA-256';

export async function hashPassword(password: string): Promise<string> {
  const saltBuf = new ArrayBuffer(16);
  crypto.getRandomValues(new Uint8Array(saltBuf));
  const salt = new Uint8Array(saltBuf);
  const saltHex = bufToHex(salt);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: ALGORITHM },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const hashHex = bufToHex(new Uint8Array(derivedBits));
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  const salt = hexToBuf(saltHex);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: ALGORITHM },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const newHashHex = bufToHex(new Uint8Array(derivedBits));
  return newHashHex === hashHex;
}

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
