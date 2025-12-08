import { createQueries, createStore } from 'tinybase/with-schemas';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite/with-schemas';
import { openDatabaseSync } from 'expo-sqlite';

// Tinybase does not support blobs, so we store the binary data as base64 strings

// Define the schema
const TABLES = {
  passwords: {
    name: { type: 'string' },
    argon2Salt: { type: 'string' },
    hkdfSalt: { type: 'string' },
    kemNonce: { type: 'string' },
    kemCiphertext: { type: 'string' },
    passwordNonce: { type: 'string' },
    passwordCiphertext: { type: 'string' },
    updatedAt: { type: 'string' },
  },
} as const;

export const LOGIN_ARGON2_SALT = 'loginArgon2Salt';
export const LOGIN_VAULT_KEY_CIPHERTEXT = 'loginVaultKeyCiphertext';
export const LOGIN_VAULT_KEY_NONCE = 'loginVaultKeyNonce';
export const LOGIN_COMPLETED_ONBOARDING = 'loginCompletedOnboarding';
export const LOGIN_HAS_BIOMETRIC_AUTH = 'loginHasBiometricAuth';
export const DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT = 'deviceKeyEncryptionKeyCiphertext';
export const DEVICE_KEY_ENCRYPTION_KEY_NONCE = 'deviceKeyEncryptionKeyNonce';
export const DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT = 'deviceKeyDecryptionKeyCiphertext';
export const DEVICE_KEY_DECRYPTION_KEY_NONCE = 'deviceKeyDecryptionKeyNonce';

const VALUES = {
  [LOGIN_ARGON2_SALT]: { type: 'string' },
  [LOGIN_VAULT_KEY_CIPHERTEXT]: { type: 'string' },
  [LOGIN_VAULT_KEY_NONCE]: { type: 'string' },
  [LOGIN_COMPLETED_ONBOARDING]: { type: 'boolean', default: false },
  [LOGIN_HAS_BIOMETRIC_AUTH]: { type: 'boolean', default: false },
  [DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT]: { type: 'string' },
  [DEVICE_KEY_ENCRYPTION_KEY_NONCE]: { type: 'string' },
  [DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT]: { type: 'string' },
  [DEVICE_KEY_DECRYPTION_KEY_NONCE]: { type: 'string' },
} as const;

export const store = createStore().setTablesSchema(TABLES).setValuesSchema(VALUES);
export const queries = createQueries(store);

const expoDb = openDatabaseSync(process.env.EXPO_PUBLIC_STORAGE_DB_FILE_NAME!);
export const persister = createExpoSqlitePersister(store, expoDb);

export async function initDatabase() {
  await persister.startAutoLoad();
  await persister.startAutoSave();
}
