import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { generatePassword as generatePasswordCore, UniffiPasswordGeneratorError_Tags } from 'react-native-harrys-password-manager-core';

import { PasswordInput } from '@/components/common/password-input';
import { colors } from '@/constants/colors';
import { GlobalStyles } from '@/constants/styles';
import OptionSlider from '@/components/add-password/option-slider';
import { InputError } from '@/components/common/input-error';

interface InputErrors {
  nameError?: string;
  passwordError?: string;
}

interface PasswordFormProps {
  initialName?: string;
  initialPassword?: string;
  submitButtonText: string;
  onSubmit: (name: string, password: string) => Promise<void>;
}

export function PasswordForm({
  initialName = '',
  initialPassword = '',
  submitButtonText,
  onSubmit,
}: PasswordFormProps) {
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState(initialPassword);
  const [errors, setErrors] = useState<InputErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  useEffect(() => {
    if (initialPassword) setPassword(initialPassword);
  }, [initialPassword]);

  // Generator State
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [minUpper, setMinUpper] = useState(1);
  const [includeLower, setIncludeLower] = useState(true);
  const [minLower, setMinLower] = useState(1);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [minNumbers, setMinNumbers] = useState(1);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [minSymbols, setMinSymbols] = useState(1);

  const generatePassword = useCallback(() => {
    try {
      const newPassword = generatePasswordCore({
        length,
        includeUppercase: includeUpper,
        includeLowercase: includeLower,
        includeNumbers: includeNumbers,
        includeSymbols: includeSymbols,
        minUppercase: minUpper,
        minLowercase: minLower,
        minNumbers: minNumbers,
        minSymbols: minSymbols,
      });
      setPassword(newPassword);
    } catch (err) {
      const e = err as any;
      if (e && typeof e === 'object' && 'tag' in e) {
        switch (e.tag) {
          case UniffiPasswordGeneratorError_Tags.TooManyRequired:
            Alert.alert(
              'Invalid Settings',
              'The sum of the minimum number of characters specified exceeds the password length.'
            );
            return;
          case UniffiPasswordGeneratorError_Tags.NoneSelected:
            Alert.alert(
              'Invalid Settings',
              'No characters are allowed to be in the password. Please select at least one type.'
            );
            return;
        }
      }
      Alert.alert('Error', 'Failed to generate password: ' + (e as Error).message);
    }
  }, [length, includeUpper, minUpper, includeLower, minLower, includeNumbers, minNumbers, includeSymbols, minSymbols]);

  const handleNameChange = (text: string) => {
    // Replace curly apostrophes with straight ones
    setName(text.replace(/[\u2018\u2019]/g, "'"));
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !password) {
      setErrors({
        nameError: name ? undefined : 'Name is required',
        passwordError: password ? undefined : 'Password is required',
      });
      setLoading(false);
      return;
    }

    await onSubmit(name, password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.boldBody2}>Name</Text>
        <TextInput
          style={GlobalStyles.input}
          placeholder="e.g. Netflix"
          placeholderTextColor={colors.white50}
          value={name}
          onChangeText={handleNameChange}
        />
        <InputError error={errors.nameError} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={GlobalStyles.boldBody2}>Password</Text>
        <View style={styles.passwordContainer}>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            style={{ flex: 1 }}
          />
          <Pressable onPress={generatePassword} style={GlobalStyles.fittedButton}>
            <FontAwesome name="refresh" size={24} color={colors.pink} />
          </Pressable>
        </View>
        <InputError error={errors.passwordError} />
      </View>

      <View style={styles.generatorContainer}>
        <Text style={styles.sectionTitle}>Generator Settings</Text>
        
        <View style={styles.lengthRow}>
          <Text style={GlobalStyles.body3}>Length: {length}</Text>
          <Slider
            style={styles.slider}
            minimumValue={4}
            maximumValue={32}
            step={1}
            value={length}
            onValueChange={setLength}
            minimumTrackTintColor={colors.white}
            maximumTrackTintColor={colors.white20}
            thumbTintColor={colors.white}
          />
        </View>

        <OptionSlider
          label="Uppercase"
          included={includeUpper}
          setIncluded={setIncludeUpper}
          minCount={minUpper}
          setMinCount={setMinUpper}
        />
        <OptionSlider
          label="Lowercase"
          included={includeLower}
          setIncluded={setIncludeLower}
          minCount={minLower}
          setMinCount={setMinLower}
        />
        <OptionSlider
          label="Numbers"
          included={includeNumbers}
          setIncluded={setIncludeNumbers}
          minCount={minNumbers}
          setMinCount={setMinNumbers}
        />
        <OptionSlider
          label="Symbols"
          included={includeSymbols}
          setIncluded={setIncludeSymbols}
          minCount={minSymbols}
          setMinCount={setMinSymbols}
        />
      </View>

      <Pressable style={GlobalStyles.largeButton} onPress={handleSubmit}>
        {loading ? <ActivityIndicator size="small" color={colors.pink} /> : <Text style={GlobalStyles.buttonText}>{submitButtonText}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  generatorContainer: {
    backgroundColor: colors.white10,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.white20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.white,
    marginBottom: 8,
  },
  lengthRow: {
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
