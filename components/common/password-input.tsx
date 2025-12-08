import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, StyleProp, ViewStyle } from 'react-native';

import { colors } from '../../constants/colors';
import { GlobalStyles } from '../../constants/styles';

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
}

export function PasswordInput({
  value,
  onChangeText,
  placeholder = 'Password',
  style,
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[GlobalStyles.input, styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.white50}
        secureTextEntry={!isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
        <Ionicons
          name={isPasswordVisible ? 'eye-off' : 'eye'}
          size={24}
          color={colors.white50}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.white,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
});
