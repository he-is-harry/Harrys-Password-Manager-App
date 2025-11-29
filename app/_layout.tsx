import { Stack } from 'expo-router';

import { SessionProvider, useSession } from '../components/auth/ctx';
import { SplashScreenController } from '../components/auth/splash';
import { Buffer } from "buffer";

// Expose Buffer globally for use so node modules can access it
global.Buffer = Buffer;

export default function Root() {
  // Set up the auth context and render your layout inside of it.
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  );
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
  const { vaultKey, isOnboarded } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!vaultKey}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Protected guard={isOnboarded && !vaultKey}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>

      <Stack.Protected guard={!isOnboarded}>
        <Stack.Screen name="create-master-password" />
      </Stack.Protected>
    </Stack>
  );
}
