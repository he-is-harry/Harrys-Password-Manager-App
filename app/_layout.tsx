import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider, useSession } from '../components/auth/ctx';
import { SplashScreenController } from '../components/auth/splash';
import { Buffer } from "buffer";

// Expose Buffer globally for use so node modules can access it
global.Buffer = Buffer;

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <SplashScreenController />
        <RootNavigator />
      </SessionProvider>
    </SafeAreaProvider>
  );
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
  const { vaultKey, hasCreatedLogin } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!vaultKey}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={hasCreatedLogin && !vaultKey}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Protected guard={!hasCreatedLogin}>
        <Stack.Screen name="create-master-password" />
      </Stack.Protected>
    </Stack>
  );
}
