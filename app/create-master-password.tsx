import { router } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { useState } from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../components/auth/ctx';
import { BackgroundLayout } from '../components/background-layout';
import { PasswordInput } from '../components/common/password-input';
import { GlobalStyles } from '../constants/styles';

export default function CreateMasterPassword() {
  const { signUp, completeOnboarding } = useSession();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!password) return;
    setLoading(true);
    try {
      await signUp(password);
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        await completeOnboarding();
        router.replace('/');
      } else {
        router.replace('/onboarding/biometric-setup');
      }
    } catch (e) {
      console.error(e);
      // Handle error (e.g. show alert)
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.paddedTopContent}>
          <Text style={[GlobalStyles.h1, { fontFamily: 'Dynapuff' }]}>Create Master Password</Text>

          <Text style={[GlobalStyles.body1, { textAlign: 'center' }]}>
            This password will be used to sign in and encrypt your other passwords. Do not lose it!
          </Text>
          <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="Master Password"
            />

          <Pressable
            style={({ pressed }) => [
              GlobalStyles.largeButton,
              pressed && GlobalStyles.buttonPressed,
              loading && GlobalStyles.buttonDisabled,
            ]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={GlobalStyles.buttonText}>
              {loading ? 'Creating...' : 'Create Account'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </BackgroundLayout>
  );
}
