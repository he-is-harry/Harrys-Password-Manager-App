import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
import { HomeHeader } from '../../components/home-header';
import { colors } from '../../constants/colors';
import { GlobalStyles } from '../../constants/styles';

export default function Index() {
  const { signOut } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BackgroundLayout>
      <SafeAreaView style={GlobalStyles.container}>
        <HomeHeader
          onAdd={() => {
            // TODO: Navigate to add password screen
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
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No passwords found</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </BackgroundLayout>
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
