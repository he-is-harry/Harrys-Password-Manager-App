import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundLayout } from '../../components/background-layout';
import { colors } from '../../constants/colors';
import { GlobalStyles } from '../../constants/styles';
import { decryptPassword, savePassword } from '@/src/passman';
import { useSession } from '@/components/auth/ctx';
import { PasswordForm } from '@/components/password-form';
import { store } from '@/src/db/store';

export default function EditPassword() {
  const { vaultKey } = useSession();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id;

  const [initialName, setInitialName] = useState('');
  const [initialPassword, setInitialPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }

    const loadPassword = async () => {
      try {
        const name = store.getCell('passwords', id, 'name');
        if (typeof name !== 'string') throw new Error('Password not found');
        setInitialName(name);

        const decrypted = await decryptPassword(id, vaultKey!);
        setInitialPassword(decrypted);
      } catch (e) {
        console.error('Failed to load password', e);
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadPassword();
  }, [id, vaultKey, router]);

  const handleUpdatePassword = async (name: string, password: string) => {
    await savePassword(name, password, vaultKey!, id);
    router.back();
  };

  if (loading) {
    return (
      <BackgroundLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      </BackgroundLayout>
    );
  }

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
          <Text style={GlobalStyles.h1}>Edit Password</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <PasswordForm
            initialName={initialName}
            initialPassword={initialPassword}
            submitButtonText="Update Password"
            onSubmit={handleUpdatePassword}
          />
        </ScrollView>
      </SafeAreaView>
    </BackgroundLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 12,
  },
  backButton: {
    padding: 8,
  },
  content: {
    gap: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
