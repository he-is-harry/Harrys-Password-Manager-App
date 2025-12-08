import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSession } from '../../components/auth/ctx';
import { BackgroundLayout } from '../../components/background-layout';
import { HomeHeader } from '../../components/password-list/home-header';
import { colors } from '../../constants/colors';
import { GlobalStyles } from '../../constants/styles';
import { queries } from '../../src/db/store';
import { updateSearchPasswords } from '../../src/passman';
import { Queries } from 'tinybase';
import { useResultTable } from 'tinybase/ui-react';
import { ListRow } from '@/components/password-list/list-row';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface PasswordRow {
  name: string;
}

export default function Index() {
  const router = useRouter();
  const { signOut } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const passwords = useResultTable('searchPasswords', queries as unknown as Queries);

  useEffect(() => {
    updateSearchPasswords(searchQuery);
  }, [searchQuery]);

  return (
    <GestureHandlerRootView>
      <BackgroundLayout>
        <SafeAreaView style={GlobalStyles.container}>
          <HomeHeader
            onAdd={() => {
              router.push('/add-password');
            }}
            onSignOut={signOut}
          />

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={colors.white60}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search passwords..."
              placeholderTextColor={colors.white60}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>


          {/* Password List */}
          <FlatList
            data={Object.entries(passwords).map(([id, password]) => ({
              id,
              ...(password as unknown as PasswordRow),
            }))}
            renderItem={({ item }) => (
              <ListRow id={item.id} passwordName={item.name} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No passwords found</Text>
              </View>
            }
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </BackgroundLayout>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white10,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.white20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
    gap: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  emptyStateText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.white60,
  },
});
