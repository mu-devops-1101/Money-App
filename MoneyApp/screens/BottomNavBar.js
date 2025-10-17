import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const overviewIcon = require('../assets/Navigation-Overview.png');
const monthIcon = require('../assets/Navigation-Month.png');
const walletIcon = require('../assets/Navigation-Wallet.png');
const settingIcon = require('../assets/Navigation-Setting.png');

const navigationItems = [
    // path ควรตรงกับชื่อ Screen ใน Navigator ของคุณ
    { id: 'Overview', icon: overviewIcon, label: 'Overview', path: 'Home' },
    { id: 'Month', icon: monthIcon, label: 'Month', path: 'ThisMonth' },
    { id: 'Wallet', icon: walletIcon, label: 'Wallet', path: 'Wallet' },
    { id: 'Setting', icon: settingIcon, label: 'Setting', path: 'Setting' },
];

const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    gray: '#888888',
    activeTint: '#5ac5a9' // สีสำหรับไอคอนเมื่อ active
};

// Component นี้จะรับ props `navigation` และ `currentRoute` เข้ามา
export const BottomNavBar = ({ navigation, currentRoute }) => {
    return (
        <View style={styles.navContainer}>
            {navigationItems.map((item) => {
                const isActive = currentRoute === item.path;

                return (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.navItem}
                        onPress={() => navigation.navigate(item.path)}
                        accessibilityLabel={`Maps to ${item.label}`}
                    >
                        <Image
                            source={item.icon}
                            style={[
                                styles.iconImage,
                                // ถ้าเมนู active ให้เปลี่ยนสีไอคอน
                                { tintColor: isActive ? COLORS.activeTint : COLORS.gray }
                            ]}
                        />
                        <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        height: 84,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 20, // สำหรับพื้นที่ด้านล่าง (Notch)
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 8,
    },
    iconImage: {
        width: 28,  // กำหนดขนาดไอคอนให้เหมาะสม
        height: 28,
        resizeMode: 'contain', // ทำให้รูปภาพไม่ผิดสัดส่วน
    },
    navLabel: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    navLabelActive: {
        color: COLORS.dark,
        fontWeight: 'bold',
    },
});