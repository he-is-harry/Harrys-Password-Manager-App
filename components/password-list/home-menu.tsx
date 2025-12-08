import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { GlobalStyles } from '@/constants/styles';

interface HomeMenuProps {
  visible: boolean;
  onClose: () => void;
  menuPosition: { top: number; right: number };
  onSignOut: () => void;
}

export function HomeMenu({
  visible,
  onClose,
  menuPosition,
  onSignOut,
}: HomeMenuProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[
            styles.menuContainer,
            { top: menuPosition.top, right: menuPosition.right },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={() => {
              onSignOut();
              onClose();
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.pink} />
            <Text style={GlobalStyles.buttonText}>Sign Out</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  menuContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: colors.lightPink,
  },
});
