import { router } from 'expo-router';
import { useState } from 'react';
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSession } from '../components/auth/ctx';

export default function CreateMasterPassword() {
    const { signUp } = useSession();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleCreate = async () => {
        if (!password) return;
        setLoading(true);
        try {
            await signUp(password);
            router.replace('/');
        } catch (e) {
            // console.error(e);
            throw e;
            // Handle error (e.g. show alert)
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.content}>
                    <Text style={styles.header}>Create Master Password</Text>

                    <Text style={styles.subtext}>
                        This password will encrypt your vault. Do not lose it!
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Master Password"
                        placeholderTextColor="rgba(255, 255, 255, 0.6)"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize="none"
                    />

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            pressed && styles.buttonPressed,
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    content: {
        alignItems: 'center',
        gap: 24,
    },
    header: {
        fontFamily: 'Dynapuff',
        fontSize: 32,
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
    },
    subtext: {
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        height: 56,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
        color: 'white',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: 'white',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
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
        opacity: 0.7,
    },
    buttonText: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: 16,
        color: 'black',
    },
});
