import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // ต้องติดตั้ง expo-linear-gradient

export default function GetStarted({ navigation }) {
    const [isSignUpHovered, setIsSignUpHovered] = useState(false);
    const [isLogInHovered, setIsLogInHovered] = useState(false);

    const handleSignUpClick = () => {
        console.log("Sign up clicked");
        // navigation.navigate("SignUp"); // TODO: ถ้ามีหน้า SignUp
    };

    const handleLogInClick = () => {
        console.log("Log in clicked");
        navigation.navigate("Login"); // เชื่อมไปหน้า Login
    };

    // <<< Return ต้องอยู่ในฟังก์ชันหลัก ไม่ใช่นอก function >>>
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

            <View style={styles.nav}>
                {/* Sign Up */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        isSignUpHovered ? styles.buttonHover : styles.buttonNormal,
                    ]}
                    onPress={handleSignUpClick}
                    onPressIn={() => setIsSignUpHovered(true)}
                    onPressOut={() => setIsSignUpHovered(false)}
                >
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                {/* Log In */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        isLogInHovered ? styles.buttonHover : styles.buttonNormal,
                    ]}
                    onPress={handleLogInClick}
                    onPressIn={() => setIsLogInHovered(true)}
                    onPressOut={() => setIsLogInHovered(false)}
                >
                    <Text style={styles.buttonText}>LOG IN</Text>
                </TouchableOpacity>
            </View>
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
        width: 250,
        height: 250,
        marginBottom: 50,
    },
    nav: {
        width: "100%",
        alignItems: "center",
        gap: 20,
    },
    button: {
        width: 300,
        height: 70,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // เงาสำหรับ Android
    },
    buttonNormal: {
        backgroundColor: "#FFFFFF",
    },
    buttonHover: {
        backgroundColor: "#F5F5F5",
    },
    buttonText: {
        fontSize: 20,
        color: "#000000",
        fontWeight: "500",
    },
});
