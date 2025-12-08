import {
  decryptDeviceKeys,
  encryptPassword,
  decryptPassword as coreDecryptPassword,
  EncryptedPassword,
} from 'react-native-harrys-password-manager-core';
import {
  store,
  queries,
  DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT,
  DEVICE_KEY_ENCRYPTION_KEY_NONCE,
  DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT,
  DEVICE_KEY_DECRYPTION_KEY_NONCE,
} from './db/store';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

export async function savePassword(
  name: string,
  password: string,
  vaultKey: ArrayBuffer,
  id?: string
) {
  // 1. Obtain the encryption key by decrypting its entry using the wrapping key from the expo secure store.
  const wrappingKeyBase64 = await SecureStore.getItemAsync(
    process.env.EXPO_PUBLIC_DEVICE_WRAPPING_KEY_NAME!
  );

  if (!wrappingKeyBase64) {
    throw new Error('Device wrapping key not found');
  }

  const wrappingKey = new Uint8Array(
    Buffer.from(wrappingKeyBase64, 'base64')
  ).buffer;

  const deviceKeyCiphertextBase64 = store.getValue(
    DEVICE_KEY_ENCRYPTION_KEY_CIPHERTEXT
  ) as string;
  const deviceKeyNonceBase64 = store.getValue(
    DEVICE_KEY_ENCRYPTION_KEY_NONCE
  ) as string;

  if (!deviceKeyCiphertextBase64 || !deviceKeyNonceBase64) {
    throw new Error('Device encryption key not found in store');
  }

  const deviceKeyCiphertext = new Uint8Array(
    Buffer.from(deviceKeyCiphertextBase64, 'base64')
  ).buffer;
  const deviceKeyNonce = new Uint8Array(
    Buffer.from(deviceKeyNonceBase64, 'base64')
  ).buffer;

  const deviceEncryptionKey = decryptDeviceKeys(
    wrappingKey,
    deviceKeyCiphertext,
    deviceKeyNonce
  );

  // 2. Encrypt the password using Harry's Password Manager Core.
  const passwordBytes = new TextEncoder().encode(password).buffer;
  const encryptedPassword = encryptPassword(
    vaultKey,
    deviceEncryptionKey,
    passwordBytes
  );

  // 3. Store that encrypted password into Tinybase
  const rowData = {
    name: name,
    argon2Salt: Buffer.from(encryptedPassword.argon2Salt()).toString('base64'),
    hkdfSalt: Buffer.from(encryptedPassword.hkdfSalt()).toString('base64'),
    kemCiphertext: Buffer.from(encryptedPassword.kemCiphertext()).toString(
      'base64'
    ),
    kemNonce: Buffer.from(encryptedPassword.kemNonce()).toString('base64'),
    passwordCiphertext: Buffer.from(
      encryptedPassword.passwordCiphertext()
    ).toString('base64'),
    passwordNonce: Buffer.from(encryptedPassword.passwordNonce()).toString(
      'base64'
    ),
    updatedAt: new Date().toISOString(),
  };

  if (id) {
    store.setRow('passwords', id, rowData);
  } else {
    store.addRow('passwords', rowData);
  }
}

export function updateSearchPasswords(searchText: string) {
  queries.setQueryDefinition(
    'searchPasswords', 
    'passwords', 
    ({ select, where }) => {
      select('name');
      where((getCell) => {
        const name = getCell('name');
        return typeof name === 'string' && name.toLowerCase().includes(searchText.toLowerCase());
      });
    }
  );
}

export async function decryptPassword(
  id: string,
  vaultKey: ArrayBuffer
): Promise<string> {
  const row = store.getRow('passwords', id);
  if (!row) {
    throw new Error('Password not found');
  }

  if (row.argon2Salt === undefined || row.hkdfSalt === undefined || row.kemCiphertext === undefined || row.kemNonce === undefined || row.passwordCiphertext === undefined || row.passwordNonce === undefined) {
    throw new Error('Malformed password row');
  }

  // 1. Obtain the encryption key by decrypting its entry using the wrapping key from the expo secure store.
  // TODO: Refactor this into a shared function to avoid duplication with savePassword
  const wrappingKeyBase64 = await SecureStore.getItemAsync(
    process.env.EXPO_PUBLIC_DEVICE_WRAPPING_KEY_NAME!
  );

  if (!wrappingKeyBase64) {
    throw new Error('Device wrapping key not found');
  }

  const wrappingKey = new Uint8Array(
    Buffer.from(wrappingKeyBase64, 'base64')
  ).buffer;

  const deviceKeyCiphertextBase64 = store.getValue(
    DEVICE_KEY_DECRYPTION_KEY_CIPHERTEXT
  ) as string;
  const deviceKeyNonceBase64 = store.getValue(
    DEVICE_KEY_DECRYPTION_KEY_NONCE
  ) as string;

  if (!deviceKeyCiphertextBase64 || !deviceKeyNonceBase64) {
    throw new Error('Device encryption key not found in store');
  }

  const deviceKeyCiphertext = new Uint8Array(
    Buffer.from(deviceKeyCiphertextBase64, 'base64')
  ).buffer;
  const deviceKeyNonce = new Uint8Array(
    Buffer.from(deviceKeyNonceBase64, 'base64')
  ).buffer;

  const deviceDecryptionKey = decryptDeviceKeys(
    wrappingKey,
    deviceKeyCiphertext,
    deviceKeyNonce
  );

  // 2. Decrypt the password using Harry's Password Manager Core.
  const argon2Salt = new Uint8Array(Buffer.from(row.argon2Salt, 'base64')).buffer;
  const hkdfSalt = new Uint8Array(Buffer.from(row.hkdfSalt, 'base64')).buffer;
  const kemCiphertext = new Uint8Array(Buffer.from(row.kemCiphertext, 'base64')).buffer;
  const kemNonce = new Uint8Array(Buffer.from(row.kemNonce, 'base64')).buffer;
  const passwordCiphertext = new Uint8Array(Buffer.from(row.passwordCiphertext, 'base64')).buffer;
  const passwordNonce = new Uint8Array(Buffer.from(row.passwordNonce, 'base64')).buffer;
  const encryptedPassword = new EncryptedPassword(argon2Salt, hkdfSalt, kemNonce, kemCiphertext, passwordNonce, passwordCiphertext);

  const decryptedPasswordBytes = coreDecryptPassword(
    vaultKey,
    deviceDecryptionKey,
    encryptedPassword
  );

  return new TextDecoder().decode(decryptedPasswordBytes);
}

export function deletePassword(id: string) {
  store.delRow('passwords', id);
}
