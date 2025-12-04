import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { useSession } from '../components/auth/ctx';
import { GlobalStyles } from '../constants/styles';
import { colors } from '../constants/colors';
import { BackgroundLayout } from '../components/background-layout';

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
    } catch (e) {
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
  }, [checkBiometricAuthEnabled]);

  const handleBiometricSignIn = async () => {
    try {
      setError(null);
      await signInBiometric();
    } catch (e) {
      setError('Biometric authentication failed');
    }
  };

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={GlobalStyles.paddedTopContent}>
          <Text style={GlobalStyles.header}>Sign In</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={GlobalStyles.input}
              placeholder="Master Password"
              placeholderTextColor={colors.white60}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              autoCapitalize="none"
            />

            {error && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
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
