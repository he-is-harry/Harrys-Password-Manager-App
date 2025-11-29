import { addUser, authenticateUser, checkUserOnboarded } from '@/src/auth';
import { runMigrations } from '@/src/db/migrate';
import { uniffiInitAsync } from 'react-native-harrys-password-manager-core';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

interface AuthContextType {
  signIn: (masterPassword: string) => void;
  signUp: (masterPassword: string) => Promise<void>;
  signOut: () => void;
  vaultKey: ArrayBuffer | null;
  isOnboarded: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => { },
  signUp: async () => { },
  signOut: () => null,
  vaultKey: null,
  isOnboarded: false,
  isLoading: true,
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
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Harry's Password Manager Core and run migrations. We put these 
        // here in ctx.tsx so that we can render the splash screen while these run.
        await uniffiInitAsync();
        await runMigrations();
        const isOnboarded = checkUserOnboarded();
        setIsOnboarded(isOnboarded);
      } catch (e) {
        console.error('Initialization failed:', e);
      } finally {
        setIsLoading(false);
      }
    }
    prepare();
  }, []);

  const wipeKey = () => {
    if (vaultKey) {
      new Uint8Array(vaultKey).fill(0);
    }
    setVaultKey(null);
  };

  const signIn = (masterPassword: string) => {
    const vaultKey = authenticateUser(masterPassword);
    setVaultKey(vaultKey);
  };

  const signUp = async (masterPassword: string) => {
    await addUser(masterPassword);
    signIn(masterPassword);
    setIsOnboarded(true);
  };

  const signOut = () => {
    wipeKey();
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        vaultKey,
        isOnboarded,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
