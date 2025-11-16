import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { loginUser, setAuthToken } from "../services/api";

const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    lightGrey: '#F2F2F2',
    textGrey: '#999999',
};

export default function Login({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Incomplete Information", "Please fill in both Username and Password");
            return;
        }

        setLoading(true);

        try {
            const credentials = { username, password };
            console.log("📤 Sending credentials:", credentials);

            const res = await loginUser(credentials);

            console.log("✅ Full Response:", res);
            console.log("✅ Response Status:", res.status);
            console.log("✅ Response Data:", res.data);
            console.log("✅ JWT Token:", res.data.jwt);

            if (res.status === 200) {
                const token = res.data.jwt || res.data.token || res.data.accessToken;

                if (token) {
                    console.log("✅ Token found, saving...");

                    // Save token to AsyncStorage
                    await AsyncStorage.setItem('token', token);

                    // Set token for axios
                    setAuthToken(token);

                    console.log("✅ Navigating to Home...");

                    // Navigate to Home
                    navigation.navigate("Home");

                    setTimeout(() => {
                        Alert.alert("Success", "Login successful!");
                    }, 100);
                } else {
                    console.error("❌ Token not found in response");
                    Alert.alert("Error", "Token not found in server response");
                }
            } else {
                console.error("❌ Unexpected status code:", res.status);
                Alert.alert("Error", "Invalid response status");
            }
        } catch (err) {
            console.error("❌ Login Error:", err);
            console.error("❌ Error Response:", err.response?.data);

            const errorMessage = err.response?.data?.message
                || err.response?.data
                || err.message
                || "Cannot connect to server";

            Alert.alert("Error", errorMessage.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[COLORS.dark, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.contentWrapper}>
                        {/* Logo */}
                        <Image
                            source={require("../assets/image-4.png")}
                            resizeMode={"contain"}
                            style={styles.logo}
                        />

                        {/* Title */}
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue to your account.</Text>

                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor={COLORS.textGrey}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                style={styles.textInput}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={COLORS.textGrey}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.textInput}
                            />
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? "Logging in..." : "LOG IN"}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign up prompt */}
                        <View style={styles.signUpPrompt}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 25,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.lightGrey,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    textInput: {
        backgroundColor: `${COLORS.white}33`,
        color: COLORS.white,
        fontSize: 16,
        borderRadius: 12,
        paddingVertical: Platform.OS === 'ios' ? 15 : 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: `${COLORS.white}66`,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: "100%",
        height: 55,
        backgroundColor: COLORS.white,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
        marginBottom: 20,
    },
    loginButtonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        color: COLORS.dark,
        fontSize: 18,
        fontWeight: "bold",
    },
    signUpPrompt: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    signUpText: {
        color: COLORS.lightGrey,
        fontSize: 14,
    },
    signUpLink: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});