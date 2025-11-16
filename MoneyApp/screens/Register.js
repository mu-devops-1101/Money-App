import { registerUser } from "../services/api"

import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    Alert,
    StyleSheet
} from "react-native";

export default function Register({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Incomplete Information", "Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Password Mismatch", "Please confirm your password correctly");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                username: username,
                password: password,
            };

            console.log("📤 Sending to backend:", userData);

            const response = await registerUser(userData);
            console.log("✅ Backend response:", response.data);

            // Show success message
            setSuccess(true);

            // Redirect after 3 seconds
            setTimeout(() => {
                navigation.navigate("GetStarted");
            }, 3000);

        } catch (err) {
            console.error("❌ Full error object:", err);
            console.error("❌ Response status:", err.response?.status);
            console.error("❌ Response data:", err.response?.data);
            console.error("❌ Request config:", err.config);

            const errorMessage = err.response?.data?.message
                || err.response?.data
                || err.message
                || "Cannot connect to server";

            Alert.alert("Error", errorMessage.toString());
        } finally {
            setLoading(false);
        }
    };

    // If success, show Success screen
    if (success) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.successContainer}>
                    <View style={styles.successIcon}>
                        <Text style={styles.checkmark}>✓</Text>
                    </View>
                    <Text style={styles.successTitle}>Account Created Successfully!</Text>
                    <Text style={styles.successSubtitle}>
                        Redirecting you to login page...
                    </Text>
                    <View style={styles.dotsContainer}>
                        <Text style={styles.dots}>• • •</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <View style={styles.logoInnerCircle}>
                            <Image
                                source={require("../assets/image-4.png")}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>

                {/* Input Fields */}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={styles.signUpButtonText}>
                        {loading ? 'Creating account...' : 'SIGN UP'}
                    </Text>
                </TouchableOpacity>

                {/* Already have account */}
                <TouchableOpacity
                    onPress={() => navigation.navigate("GetStarted")}
                    style={{ marginTop: 20, alignItems: 'center' }}
                >
                    <Text style={{ color: '#666', fontSize: 14 }}>
                        Already have an account? <Text style={{ color: '#5AC5A9', fontWeight: 'bold' }}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },
    scrollViewContent: {
        paddingHorizontal: 45,
        paddingBottom: 50
    },
    logoContainer: {
        backgroundColor: "#FEFEFE",
        borderRadius: 36,
        padding: 1,
        marginTop: 100,
        marginBottom: 40,
        alignSelf: 'center'
    },
    logoBackground: {
        backgroundColor: "#5AC5A9",
        borderRadius: 36,
        padding: 21
    },
    logoInnerCircle: {
        backgroundColor: "#FFFFFF",
        borderRadius: 36,
        padding: 34,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoImage: {
        width: 33,
        height: 27
    },
    input: {
        color: "#000",
        fontSize: 14,
        marginBottom: 20,
        backgroundColor: "#F4F4F8",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    signUpButton: {
        alignItems: "center",
        backgroundColor: "#5AC5A9",
        borderRadius: 28,
        paddingVertical: 18,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    signUpButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 'bold'
    },
    // Success Screen Styles
    successContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#5AC5A9",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30
    },
    checkmark: {
        fontSize: 60,
        color: "#FFFFFF",
        fontWeight: "bold"
    },
    successTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 15,
        textAlign: "center"
    },
    successSubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20
    },
    dotsContainer: {
        marginTop: 10
    },
    dots: {
        fontSize: 24,
        color: "#5AC5A9",
        letterSpacing: 8
    }
});