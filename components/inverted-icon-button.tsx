import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet } from 'react-native';
import { GlobalStyles } from '@/constants/styles';
import { colors } from '@/constants/colors';

const SMALL_INDICATOR_SIZE = 20;

interface InvertedIconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  isLoading?: boolean;
}

export function InvertedIconButton({ 
  iconName, 
  iconSize = 16, 
  iconColor = colors.white,
  isLoading = false,
  ...pressableProps 
}: InvertedIconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        GlobalStyles.invertedIconButton,
        pressed && GlobalStyles.buttonPressed,
        isLoading && styles.buttonLoading,
      ]}
      disabled={isLoading}
      {...pressableProps}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={iconColor} 
          style={{ transform: [{ scale: iconSize / SMALL_INDICATOR_SIZE }] }} 
        />
      ) : (
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonLoading: {
    paddingBlock: 4,
    paddingInline: 6,
  }
});
