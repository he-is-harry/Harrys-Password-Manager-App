import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackgroundLayout } from '../../components/background-layout';
import { colors } from '../../constants/colors';
import { GlobalStyles } from '../../constants/styles';
import { savePassword } from '@/src/passman';
import { useSession } from '@/components/auth/ctx';
import { PasswordForm } from '@/components/password-form';

export default function AddPassword() {
  const { vaultKey } = useSession();
  const router = useRouter();

  const handleAddPassword = async (name: string, password: string) => {
    await savePassword(name, password, vaultKey!);
    router.back();
  };

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
          <Text style={GlobalStyles.h1}>Add Password</Text>
          <View style={{ width: 24 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <PasswordForm
            submitButtonText="Save Password"
            onSubmit={handleAddPassword}
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
});
