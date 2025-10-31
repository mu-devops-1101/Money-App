import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Profile({ navigation }) {
    const [profileData] = useState({
        username: "Wednesday_Addams",
        firstName: "Wednesday",
        lastName: "Addams",
        dateOfBirth: "20-12-1990",
        displayName: "Wednesday A.",
        status: "Online",
        isOnline: true,
    });

    const handleLogout = () => {
        console.log("Logging out...");
    };

    const handleBackNavigation = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient colors={["#FFFFFF", "#B2EED9"]} style={styles.container}>
                {/* ปุ่มย้อนกลับ */}
                <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>

                {/* หัวข้อ */}
                <Text style={styles.header}>Profile</Text>

                {/* ส่วนรูปโปรไฟล์ */}
                <View style={styles.profileSection}>
                    <View style={{ position: "relative" }}>
                        <Image
                            source={require("../assets/Profile-image.png")}
                            style={styles.profileImage}
                        />
                        {profileData.isOnline && <View style={styles.onlineDot} />}
                    </View>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.displayName}>{profileData.displayName}</Text>
                        <Text style={styles.status}>{profileData.status}</Text>
                    </View>
                </View>

                {/* ส่วนข้อมูล */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Username</Text>
                        <Text style={styles.value}>{profileData.username}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>First Name</Text>
                        <Text style={styles.value}>{profileData.firstName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Last Name</Text>
                        <Text style={styles.value}>{profileData.lastName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <Text style={styles.value}>{profileData.dateOfBirth}</Text>
                    </View>
                </View>

                {/* ปุ่มออกจากระบบ */}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <View style={styles.logoutContent}>
                        <Text style={styles.logoutText}>Log out</Text>
                        <Ionicons name="log-out-outline" size={20} color="#000" />
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
    },
    backButton: {
        marginTop: 10,
    },
    header: {
        fontSize: 34,
        fontWeight: "700",
        color: "#333",
        marginTop: 10,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 24,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    onlineDot: {
        position: "absolute",
        bottom: 4,
        right: 4,
        width: 12,
        height: 12,
        backgroundColor: "#20c968",
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#fff",
    },
    displayName: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },
    status: {
        fontSize: 14,
        color: "#5ac5a9",
        marginTop: 2,
    },
    infoSection: {
        marginTop: 36,
    },
    infoRow: {
        borderBottomWidth: 1,
        borderBottomColor: "#C6C6C6",
        paddingBottom: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 13,
        color: "#333",
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
        color: "#000",
        marginTop: 2,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: "#A0A0A0",
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        backgroundColor: "#fff",
    },
    logoutContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
    },
});
