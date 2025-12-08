import {
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Slider from '@react-native-community/slider';
import { colors } from '../../constants/colors';

interface OptionSliderProps {
  label: string,
  included: boolean,
  setIncluded: (val: boolean) => void,
  minCount: number,
  setMinCount: (val: number) => void
}

export default function OptionSlider({
  label,
  included,
  setIncluded,
  minCount,
  setMinCount,
}: OptionSliderProps) {
  return (
    <View style={styles.optionRow}>
      <Pressable
        style={[styles.checkbox, included && styles.checkboxChecked]}
        onPress={() => setIncluded(!included)}
      >
        {included && <Text style={styles.checkboxText}>{minCount}</Text>}
      </Pressable>
      <Text style={styles.optionLabel}>{label}</Text>
      {included && (
        <Slider
          key={label}
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={minCount}
          onValueChange={setMinCount}
          minimumTrackTintColor={colors.white}
          maximumTrackTintColor={colors.white20}
          thumbTintColor={colors.white}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 40,
  },
  optionLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.white,
    minWidth: 80,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: colors.white,
  },
  checkboxText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.black,
  },
});
