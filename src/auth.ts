import { eq } from 'drizzle-orm';
import { decryptVaultKey, EncryptedVaultKey, generateEncryptedVaultKey } from 'react-native-harrys-password-manager-core';
import { db } from './db/index';
import { logins } from './db/schema/logins';

// Returns if a user has setup a master password
export function checkUserOnboarded() {
  const login = db.select().from(logins).where(eq(logins.id, 1)).get();
  return !!login;
}

// Returns user's vault key if successfully authenticated, otherwise returns an
// error
export function authenticateUser(masterPassword: string) {
  const login = db.select().from(logins).where(eq(logins.id, 1)).get();

  if (!login) {
    throw new Error('User not found');
  }

  const masterPasswordBytes = new TextEncoder().encode(masterPassword);

  // Drizzle returns the values as Buffer<ArrayBufferLike> which we have to convert to ArrayBuffer
  const argon2SaltBuffer = new Uint8Array(login.argon2Salt).buffer;
  const vaultKeyCiphertextBuffer = new Uint8Array(login.vaultKeyCiphertext).buffer;
  const vaultKeyNonceBuffer = new Uint8Array(login.vaultKeyNonce).buffer;

  const vaultKey = decryptVaultKey(masterPasswordBytes.buffer, new EncryptedVaultKey(argon2SaltBuffer, vaultKeyCiphertextBuffer, vaultKeyNonceBuffer));

  masterPasswordBytes.fill(0);

  return vaultKey;
}

// Adds a new user to the database
export async function addUser(masterPassword: string) {
  const masterPasswordBytes = new TextEncoder().encode(masterPassword);

  const encrypted = generateEncryptedVaultKey(masterPasswordBytes.buffer);

  await db.insert(logins).values({
    // @ts-ignore -- It is possible to pass in a id, but typescript seems to dislike it
    id: 1,
    argon2Salt: new Uint8Array(encrypted.argon2Salt()),
    vaultKeyCiphertext: new Uint8Array(encrypted.vaultKeyCiphertext()),
    vaultKeyNonce: new Uint8Array(encrypted.vaultKeyNonce()),
  });

  masterPasswordBytes.fill(0);
}
