import { decryptVaultKey, EncryptedVaultKey } from 'react-native-harrys-password-manager-core';
import { store, LOGIN_ARGON2_SALT, LOGIN_VAULT_KEY_CIPHERTEXT, LOGIN_VAULT_KEY_NONCE } from '../db/index';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

// Returns user's vault key if successfully authenticated, otherwise returns an
// error
export function authenticateUser(masterPassword: string) {
  if (!store.hasValue(LOGIN_VAULT_KEY_CIPHERTEXT)) {
    throw new Error('User not found');
  }

  const { [LOGIN_ARGON2_SALT]: loginArgon2Salt, [LOGIN_VAULT_KEY_CIPHERTEXT]: loginVaultKeyCiphertext, [LOGIN_VAULT_KEY_NONCE]: loginVaultKeyNonce } = store.getValues();

  if (!loginArgon2Salt || !loginVaultKeyCiphertext || !loginVaultKeyNonce) {
    throw new Error('Corrupt login data');
  }

  const masterPasswordBytes = new TextEncoder().encode(masterPassword);

  const argon2SaltBuffer = Buffer.from(loginArgon2Salt, 'base64');
  const vaultKeyCiphertextBuffer = Buffer.from(loginVaultKeyCiphertext, 'base64');
  const vaultKeyNonceBuffer = Buffer.from(loginVaultKeyNonce, 'base64');

  const vaultKey = decryptVaultKey(masterPasswordBytes.buffer, new EncryptedVaultKey(argon2SaltBuffer.buffer, vaultKeyCiphertextBuffer.buffer, vaultKeyNonceBuffer.buffer));

  masterPasswordBytes.fill(0);

  return vaultKey;
}

// Returns the user's vault key from the secure store, which is stored only when they
// have setup biometric authentication
export async function authenticateUserBiometric() {
  const vaultKeyString = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_VAULT_KEY_NAME!, {
    requireAuthentication: true,
  });

  if (!vaultKeyString) {
    return Promise.reject(new Error('Vault key not found in secure store'));
  }

  const vaultKeyBuffer = Buffer.from(vaultKeyString, 'base64');

  return vaultKeyBuffer.buffer;
}
