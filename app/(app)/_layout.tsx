import { Stack } from "expo-router";

export default function AppLayout() {
  // This renders the navigation stack for all authenticated app routes.
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add-password" options={{ headerShown: false }} />
      <Stack.Screen name="edit-password" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} /> 
    </Stack>);
}
