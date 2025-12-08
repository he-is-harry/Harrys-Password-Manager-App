import { addLogin, authenticateUser, authenticateUserBiometric, checkBiometricAuthEnabled, checkCompletedOnboarding, checkLoginCreated, completeOnboardingSave } from '@/src/auth';

import { uniffiInitAsync } from 'react-native-harrys-password-manager-core';
import { createContext, use, useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import {
  initDatabase,
} from '@/src/db';
import { AppState } from 'react-native';

interface AuthContextType {
  signIn: (masterPassword: string) => void;
  signUp: (masterPassword: string) => Promise<void>;
  signOut: () => void;
  vaultKey: ArrayBuffer | null;
  hasCreatedLogin: boolean;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
  signInBiometric: () => Promise<void>;
  checkBiometricAuthEnabled: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => { },
  signUp: async () => { },
  signOut: () => null,
  vaultKey: null,
  hasCreatedLogin: false,
  hasCompletedOnboarding: false,
  completeOnboarding: async () => { },
  isLoading: true,
  signInBiometric: async () => { },
  checkBiometricAuthEnabled: () => false,
});

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [vaultKey, setVaultKey] = useState<ArrayBuffer | null>(null);
  const [hasCreatedLogin, setHasCreatedLogin] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  const wipeKey = useCallback(() => {
    if (vaultKey) {
      new Uint8Array(vaultKey).fill(0);
    }
    setVaultKey(null);
  }, [vaultKey, setVaultKey]);

  const signIn = (masterPassword: string) => {
    const vaultKey = authenticateUser(masterPassword);
    setVaultKey(vaultKey);
  };

  const signInBiometric = async () => {
    try {
      const vaultKey = await authenticateUserBiometric();
      setVaultKey(vaultKey);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const signUp = async (masterPassword: string) => {
    await addLogin(masterPassword);
    signIn(masterPassword);
    setHasCreatedLogin(true);
  };

  const signOut = useCallback(() => {
    wipeKey();
  }, [wipeKey]);

  const completeOnboarding = async () => {
    await completeOnboardingSave();
    setHasCompletedOnboarding(true);
  }

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Harry's Password Manager Core and run migrations. We put these 
        // here in ctx.tsx so that we can render the splash screen while these run.
        await uniffiInitAsync();
        await initDatabase();

        const hasCreatedLogin = checkLoginCreated();
        setHasCreatedLogin(hasCreatedLogin);
        if (hasCreatedLogin) {
          const completedOnboarding = checkCompletedOnboarding();
          setHasCompletedOnboarding(completedOnboarding);
        }
      } catch (e) {
        console.error('Initialization failed:', e);
      } finally {
        setIsLoading(false);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    // Add a listener that checks if the app was moved to the background and signs out
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        (appState.current === 'active' || appState.current === 'inactive') &&
        nextAppState === 'background'
      ) {
        signOut();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        vaultKey,
        hasCreatedLogin,
        hasCompletedOnboarding,
        completeOnboarding,
        isLoading,
        signInBiometric,
        checkBiometricAuthEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
