import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// 3. (แนะนำ) สร้าง Object สำหรับจัดการสี ทำให้แก้ไขธีมสีในอนาคตได้ง่าย
const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    lightGrey: '#F2F2F2',
};

export default function GetStarted({ navigation }) {

    return (
        <LinearGradient
            colors={[COLORS.dark, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.contentContainer}>
                {/* โลโก้ */}
                <Image
                    source={require("../assets/image-4.png")} // ตรวจสอบว่า path ถูกต้อง
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* 1. เพิ่มข้อความต้อนรับเพื่อปรับปรุง UX */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Welcome to Money App</Text>
                    <Text style={styles.welcomeSubtitle}>Track your expenses, manage your future.</Text>
                </View>

                {/* ปุ่มเลือก */}
                <View style={styles.buttonContainer}>
                    {/* 2. แยกสไตล์ปุ่มหลัก (Primary) และปุ่มรอง (Secondary) */}
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={[styles.buttonText, styles.primaryButtonText]}>SIGN UP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>LOG IN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around", // ปรับการจัดวางให้กระจายตัวสวยงาม
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    logo: {
        width: 200,
        height: 200,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: COLORS.lightGrey,
        marginTop: 8,
        textAlign: 'center',
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        gap: 15,
    },
    button: {
        width: "90%",
        maxWidth: 320, // กำหนดความกว้างสูงสุดสำหรับหน้าจอใหญ่ (เว็บ)
        height: 55,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({ // เพิ่มเงาให้ดูดีขึ้น
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
    },
    primaryButton: {
        backgroundColor: COLORS.white,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    primaryButtonText: {
        color: COLORS.dark,
    },
    secondaryButtonText: {
        color: COLORS.white,
    },
});