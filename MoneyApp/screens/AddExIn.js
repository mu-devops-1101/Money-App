import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Frame4 } from "./Frame4";
import { NavigationMenuSection } from "./NavigationMenuSection";
import { TransactionFormSection } from "./TransactionFormSection";

// แนะนำเก็บภาพในโฟลเดอร์ assets
import chevronLeft from "../assets/chevron-left.jpg";
import image7 from "../assets/image-4.png";
import image from "../assets/image.png";

export const AddExIn = () => {
    return (
        <View style={styles.container}>
            {/* Background Gradient Shape */}
            <View style={styles.bgShape} />

            {/* Header */}
            <View style={styles.header}>
                <Image source={chevronLeft} style={styles.icon} resizeMode="contain" />
                <Text style={styles.headerTitle}>My Wallet</Text>
                <Frame4 />
            </View>

            {/* Navigation Menu Section */}
            <NavigationMenuSection />

            {/* Transaction Form Section */}
            <TransactionFormSection />

            {/* Decorative Image */}
            <Image source={image7} style={styles.decorImage} resizeMode="contain" />

            {/* Overlay Icon */}
            {/*<Image source={image} style={styles.overlayIcon} resizeMode="contain" />*/}

            {/* Page Title */}
            <Text style={styles.pageTitle}>Add New Transaction</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 390,
        minHeight: 844,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    bgShape: {
        position: "absolute",
        top: -375,
        left: -272,
        width: 761,
        height: 484,
        borderRadius: 243,
        transform: [{ rotate: "-178.9deg" }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        backgroundColor: "linear-gradient(295deg, #363636 7%, #5ac5a9 100%)",
    },
    header: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 40,
        paddingHorizontal: 10,
    },
    icon: {
        width: 30,
        height: 30,
    },
    headerTitle: {
        fontFamily: "Inter-Bold",
        fontWeight: "700",
        fontSize: 24,
        color: "#f2f2f2",
    },
    decorImage: {
        position: "absolute",
        top: 0,
        left: "35%",
        width: 127,
        height: 116,
    },
    overlayIcon: {
        position: "absolute",
        top: 40,
        left: 50,
        width: 30,
        height: 30,
    },
    pageTitle: {
        position: "absolute",
        top: 157,
        left: "20%",
        width: "60%",
        fontFamily: "DM_Sans-ExtraBold",
        fontWeight: "800",
        fontSize: 32,
        textAlign: "center",
        color: "#000",
    },
});
