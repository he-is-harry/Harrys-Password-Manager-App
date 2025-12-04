import { store, LOGIN_VAULT_KEY_CIPHERTEXT, LOGIN_COMPLETED_ONBOARDING, LOGIN_HAS_BIOMETRIC_AUTH } from '../db/index';

// Returns if a user has setup a master password
export function checkLoginCreated() {
  return store.hasValue(LOGIN_VAULT_KEY_CIPHERTEXT);
}

// Returns if the user has completed onboarding
export function checkCompletedOnboarding() {
  return store.getValue(LOGIN_COMPLETED_ONBOARDING);
}

// Returns if the user has biometric auth enabled
export function checkBiometricAuthEnabled() {
  return store.getValue(LOGIN_HAS_BIOMETRIC_AUTH);
}
