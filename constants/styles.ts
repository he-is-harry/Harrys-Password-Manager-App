import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const GlobalStyles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    paddedTopContent: {
        paddingTop: 128,
        gap: 24,
    },
    header: {
        fontFamily: 'Dynapuff',
        fontSize: 32,
        color: colors.white,
        textAlign: 'center',
        lineHeight: 40,
    },
    body: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: colors.white,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: colors.white10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.white20,
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: colors.white,
    },
    largeButton: {
        width: '100%',
        height: 56,
        backgroundColor: colors.white,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        backgroundColor: colors.gray,
    },
    buttonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: colors.black,
    },
    buttonSecondary: {
        width: '100%',
        height: 56,
        backgroundColor: colors.transparent,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    buttonSecondaryText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: colors.white,
    },
});
