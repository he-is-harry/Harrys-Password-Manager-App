import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { GlobalStyles } from '@/constants/styles';
import { HomeMenu } from './home-menu';

interface HomeHeaderProps {
  onAdd: () => void;
  onSignOut: () => void;
}

export function HomeHeader({ onAdd, onSignOut }: HomeHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const handleOpenMenu = () => {
    buttonRef.current?.measureInWindow((_x, y, _width, height) => {
      setMenuPosition({
        top: y + height,
        right: 24,
      });
      setMenuVisible(true);
    });
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleContainer}>
        <Text style={GlobalStyles.h2}>Harry&apos;s Password Manager</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable
          style={({ pressed }) => [
            GlobalStyles.fittedButton,
            pressed && GlobalStyles.buttonPressed,
          ]}
          onPress={onAdd}
        >
          <Text style={[GlobalStyles.buttonText, { color: colors.pink }]}>+ Add</Text>
        </Pressable>
        <View ref={buttonRef} collapsable={false}>
          <Pressable
            style={({ pressed }) => [
              styles.accountButton,
              pressed && GlobalStyles.buttonPressed,
            ]}
            onPress={handleOpenMenu}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={colors.pink}
            />
          </Pressable>
        </View>

        <HomeMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          menuPosition={menuPosition}
          onSignOut={onSignOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    marginBottom: 24,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  profileButton: {
    padding: 4,
  },
});
