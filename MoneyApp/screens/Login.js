import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        console.log("Login attempt:", { email, password });
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
    };

    return (
        <LinearGradient
            colors={['#363636', '#5ac5a9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Image
                source={require("../assets/image-4.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#f4f4f8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#f4f4f8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 40,
    },
    input: {
        width: 300,
        height: 50,
        backgroundColor: "#f4f4f833",
        borderColor: "#f4f4f8",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        color: "#fff",
        marginVertical: 10,
    },
    forgot: {
        color: "#000",
        fontSize: 12,
        textDecorationLine: "underline",
        alignSelf: "flex-end",
        marginVertical: 5,
    },
    button: {
        width: 300,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "600",
    },
});
