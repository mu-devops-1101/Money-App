import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function GetStarted({ navigation }) {

    return (
        <LinearGradient
            colors={['#363636', '#5ac5a9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* โลโก้ */}
            <Image
                source={require("../assets/image-4.png")}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* ปุ่มเลือก */}
            <View style={styles.nav}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.buttonText}>SIGN UP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Login")}
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
        marginBottom: 60,
    },
    nav: {
        width: "100%",
        alignItems: "center",
        gap: 20,
    },
    button: {
        width: 280,
        height: 60,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
});
