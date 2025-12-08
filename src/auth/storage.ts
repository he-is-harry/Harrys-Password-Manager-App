import { generateEncryptedVaultKey, generateEncryptedDeviceKeys } from 'react-native-harrys-password-manager-core';
import {
  store,
  LOGIN_ARGON2_SALT,
  LOGIN_VAULT_KEY_CIPHERTEXT,
  LOGIN_VAULT_KEY_NONCE,
  LOGIN_COMPLETED_ONBOARDING,
  LOGIN_HAS_BIOMETRIC_AUTH,
  DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT,
  DEVICE_KEY_ENCRYPTION_KEY_NONCE,
  DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT,
  DEVICE_KEY_DECRYPTION_KEY_NONCE,
} from '../db/index';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

// Saves that the user completed onboarding in the database
export async function completeOnboardingSave() {
  store.setValue(LOGIN_COMPLETED_ONBOARDING, true);
}

// Adds a new login to the database
export async function addLogin(masterPassword: string) {
  const masterPasswordBytes = new TextEncoder().encode(masterPassword);

  const encrypted = generateEncryptedVaultKey(masterPasswordBytes.buffer);
  const encryptedDeviceKeys = generateEncryptedDeviceKeys();

  await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_DEVICE_WRAPPING_KEY_NAME!, Buffer.from(encryptedDeviceKeys.wrappingKey()).toString('base64'), {
    requireAuthentication: false,
  });

  store.setValues({
    [LOGIN_ARGON2_SALT]: Buffer.from(encrypted.argon2Salt()).toString('base64'),
    [LOGIN_VAULT_KEY_CIPHERTEXT]: Buffer.from(encrypted.vaultKeyCiphertext()).toString('base64'),
    [LOGIN_VAULT_KEY_NONCE]: Buffer.from(encrypted.vaultKeyNonce()).toString('base64'),
    [LOGIN_COMPLETED_ONBOARDING]: false,
    [LOGIN_HAS_BIOMETRIC_AUTH]: false,
    [DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT]: Buffer.from(encryptedDeviceKeys.encryptionKeyCiphertext()).toString('base64'),
    [DEVICE_KEY_ENCRYPTION_KEY_NONCE]: Buffer.from(encryptedDeviceKeys.encryptionKeyNonce()).toString('base64'),
    [DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT]: Buffer.from(encryptedDeviceKeys.decryptionKeyCiphertext()).toString('base64'),
    [DEVICE_KEY_DECRYPTION_KEY_NONCE]: Buffer.from(encryptedDeviceKeys.decryptionKeyNonce()).toString('base64'),
  });
}

// Sets up the user's login to support biometrics
export async function setupBiometricLogin(vaultKey: ArrayBuffer) {
  const vaultKeyBuffer = Buffer.from(vaultKey);
  const vaultKeyString = vaultKeyBuffer.toString('base64');
  await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_VAULT_KEY_NAME!, vaultKeyString, {
    requireAuthentication: true,
  });

  store.setValue(LOGIN_HAS_BIOMETRIC_AUTH, true);
}
