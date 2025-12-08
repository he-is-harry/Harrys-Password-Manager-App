import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSession } from '@/components/auth/ctx';
import { setupBiometricLogin } from '@/src/auth';
import { GlobalStyles } from '@/constants/styles';
import { BackgroundLayout } from '@/components/background-layout';

export default function BiometricSetup() {
  const { vaultKey, completeOnboarding } = useSession();
  const [supportsBiometricAuth, setSupportsBiometricAuth] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setSupportsBiometricAuth(hasHardware && isEnrolled);
  };

  const handleSetupBiometric = async () => {
    try {
      await setupBiometricLogin(vaultKey!); // vaultKey is defined because the route requires it
      await completeOnboarding();
      router.replace('/');
    } catch (e) {
      console.error(e);
      // TODO: Handle error (e.g. show alert)
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/');
  }

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.paddedTopContent}>
          <Text style={GlobalStyles.h1}>Biometric Setup</Text>

          <Text style={[GlobalStyles.body1, { textAlign: 'center' }]}>
            {supportsBiometricAuth
              ? "Enable biometric authentication for quicker access."
              : "Your device does not support biometrics or it's not set up. You can manage this in your device settings."}
          </Text>

          <Pressable
            style={({ pressed }) => [
              GlobalStyles.largeButton,
              pressed && GlobalStyles.buttonPressed,
              !supportsBiometricAuth && GlobalStyles.buttonDisabled,
            ]}
            onPress={handleSetupBiometric}
            disabled={!supportsBiometricAuth}
          >
            <Text style={GlobalStyles.buttonText}>
              Setup Biometric Authentication
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              GlobalStyles.buttonSecondary,
              pressed && GlobalStyles.buttonPressed,
            ]}
            onPress={handleSkip}
          >
            <Text style={GlobalStyles.buttonSecondaryText}>Skip for now</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </BackgroundLayout>
  );
}
