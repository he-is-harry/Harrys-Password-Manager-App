import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export const InputError = ({ error }: { error: string | null | undefined }) => {
    return (
        error ? (
            <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        ) : null
    );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
});