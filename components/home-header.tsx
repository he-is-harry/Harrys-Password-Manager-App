import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

interface HomeHeaderProps {
    onAdd: () => void;
    onSignOut: () => void;
}

export function HomeHeader({ onAdd, onSignOut }: HomeHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Harry's Password Manager</Text>
            <View style={styles.headerActions}>
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onAdd}
                >
                    <Text style={styles.addButtonText}>+ Add</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [
                        styles.profileButton,
                        pressed && { opacity: 0.7 },
                    ]}
                    onPress={onSignOut}
                >
                    <Ionicons name="person-circle-outline" size={32} color={colors.white} />
                </Pressable>
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
    headerTitle: {
        fontFamily: 'Dynapuff',
        fontSize: 24,
        color: colors.white,
        flex: 1,
        marginRight: 16,
        lineHeight: 32,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    addButton: {
        backgroundColor: colors.white20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 14,
        color: colors.white,
    },
    profileButton: {
        padding: 4,
    },
});
