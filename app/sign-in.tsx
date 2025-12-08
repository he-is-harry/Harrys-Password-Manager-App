import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../components/auth/ctx';
import { GlobalStyles } from '../constants/styles';
import { colors } from '../constants/colors';
import { BackgroundLayout } from '../components/background-layout';
import { PasswordInput } from '../components/common/password-input';
import { InputError } from '@/components/common/input-error';

export default function SignIn() {
  const { signIn, signInBiometric, checkBiometricAuthEnabled } = useSession();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBiometricAuth, setHasBiometricAuth] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setError(null);
    try {
      signIn(password);
      router.replace('/');
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkBiometricAuthEnabled()) {
      setHasBiometricAuth(true);
      signInBiometric().catch((e) => {
        setError('Biometric authentication failed');
      });
    } else {
      setHasBiometricAuth(false);
    }
  }, [checkBiometricAuthEnabled, signInBiometric]);

  const handleBiometricSignIn = async () => {
    try {
      setError(null);
      await signInBiometric();
    } catch {
      setError('Biometric authentication failed');
    }
  };

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.paddedTopContent}>
          <Text style={GlobalStyles.h1}>Sign In</Text>

          <View style={styles.inputContainer}>
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="Master Password"
            />

            <InputError error={error} />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                GlobalStyles.largeButton,
                pressed && GlobalStyles.buttonPressed,
                loading && GlobalStyles.buttonDisabled,
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={GlobalStyles.buttonText}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Text>
            </Pressable>

            {hasBiometricAuth && (
              <Pressable
                style={({ pressed }) => [
                  GlobalStyles.largeButton,
                  GlobalStyles.buttonSecondary,
                  pressed && GlobalStyles.buttonPressed,
                ]}
                onPress={handleBiometricSignIn}
              >
                <Text style={[GlobalStyles.buttonText, GlobalStyles.buttonSecondaryText]}>
                  Sign In with Biometrics
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    gap: 4,
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
});
