import { useSession } from '@/components/auth/ctx';
import { decryptPassword, deletePassword } from '@/src/passman';
import * as Clipboard from 'expo-clipboard';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/colors';
import { InvertedIconButton } from '../inverted-icon-button';

interface ListRowProps {
  id: string;
  passwordName: string;
}

export function ListRow({ id, passwordName }: ListRowProps) {
  const router = useRouter();
  const swipeableRef = useRef<any>(null);
  const { vaultKey } = useSession();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const toggleUnlock = () => {
    setIsUnlocked((prev) => !prev);
    if (isUnlocked) {
      setDecryptedPassword(null);
    }
  }

  /* Manual double tap implementation */
  const lastTapRef = useRef<number>(0);
  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      toggleUnlock();
    }
    lastTapRef.current = now;
  };

  const handleViewToggle = async () => {
    if (decryptedPassword) {
      setDecryptedPassword(null);
    } else {
      setIsDecrypting(true);
      try {
        if (vaultKey) {
          const password = await decryptPassword(id, vaultKey);
          setDecryptedPassword(password);
        }
      } catch (e) {
        console.error('Failed to decrypt password', e);
      } finally {
        setIsDecrypting(false);
      }
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      let passwordToCopy = decryptedPassword;
      if (!passwordToCopy && vaultKey) {
        passwordToCopy = await decryptPassword(id, vaultKey);
      }

      if (passwordToCopy) {
        await Clipboard.setStringAsync(passwordToCopy);
        setShowCopySuccess(true);
        setTimeout(() => {
          setShowCopySuccess(false);
        }, 1000);
      }
    } catch (e) {
      console.error('Failed to copy password', e);
    } finally {
      setIsCopying(false);
    }
  };

  const renderRightActions = () => {
    return (
      <View style={[styles.swipeContainer, styles.rightActionContainer]}>
        <TouchableOpacity
          style={styles.swipeButton}
          onPress={() => deletePassword(id)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View style={[styles.swipeContainer, styles.leftActionContainer]}>
        <TouchableOpacity
          style={styles.swipeButton}
          onPress={() => {
            swipeableRef.current.close();
            router.push({ pathname: '/edit-password', params: { id } });
          }}
        >
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      containerStyle={styles.swipeableContainer}
    >
      <Pressable onPress={handlePress}>
        <View style={[styles.passwordItem, isUnlocked && styles.passwordItemUnlocked]}>
          {isUnlocked ? (
            <View style={styles.mainRow}>
              <Text style={styles.passwordName}>{decryptedPassword ? decryptedPassword : '••••••••••••'}</Text>
              <View style={styles.buttonsRow}>
                <InvertedIconButton
                  iconName={decryptedPassword ? "eye-off" : "eye"}
                  onPress={handleViewToggle}
                  isLoading={isDecrypting}
                />
                <InvertedIconButton
                  iconName={showCopySuccess ? "checkmark-sharp" : "copy-outline"}
                  onPress={handleCopy}
                  isLoading={isCopying}
                />
                <InvertedIconButton
                  iconName="lock-open-outline"
                  onPress={toggleUnlock}
                />
              </View>
            </View>
          ) : (
            <View style={styles.mainRow}>
              <Text style={styles.passwordName}>{passwordName}</Text>
              <InvertedIconButton
                iconName="lock-closed-outline"
                onPress={toggleUnlock}
              />
            </View>
          )}
        </View>
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  passwordItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  passwordItemUnlocked: {
    backgroundColor: colors.white,
    gap: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  passwordName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.black,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    gap: 24,
  },
  actionButton: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.pink,
  },
  swipeContainer: {
    backgroundColor: colors.pink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionContainer: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  leftActionContainer: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  swipeButton: {
    padding: 16,
  }
});
