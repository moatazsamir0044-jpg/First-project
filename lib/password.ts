import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'crypto'

// Password hashing using Node's built-in scrypt (memory-hard KDF). No native
// dependencies, so it runs identically on local, CI, and serverless runtimes.
// Stored format: scrypt$N$<saltHex>$<hashHex>
const KEYLEN = 64
const COST = 16384 // 2^14 — OWASP-recommended minimum for scrypt N

function scryptAsync(password: string, salt: Buffer, keylen: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await scryptAsync(plain, salt, KEYLEN, { N: COST })
  return `scrypt$${COST}$${salt.toString('hex')}$${derived.toString('hex')}`
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 4 || parts[0] !== 'scrypt') return false

  const cost = Number(parts[1])
  const salt = Buffer.from(parts[2], 'hex')
  const expected = Buffer.from(parts[3], 'hex')
  if (!Number.isFinite(cost) || salt.length === 0 || expected.length === 0) return false

  const derived = await scryptAsync(plain, salt, expected.length, { N: cost })
  // Constant-time comparison guards against timing attacks.
  if (derived.length !== expected.length) return false
  return timingSafeEqual(derived, expected)
}
