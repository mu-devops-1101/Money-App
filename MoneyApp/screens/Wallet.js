import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomNavBar } from "./BottomNavBar";

export default function Wallet() {
    const navigation = useNavigation();
    const route = useRoute();
    const [activeTab, setActiveTab] = useState("Transactions");

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient colors={["#4AC29A", "#BDFFF3"]} style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Wallet</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="#636e72" />
                    <Text style={styles.searchPlaceholder}>Search...</Text>
                </View>
            </LinearGradient>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 130 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Total Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceValue}>฿5,000.00</Text>

                    <View style={styles.actionRow}>
                        {/* ✅ ปุ่ม Income */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("AddTransaction", { type: "income" })}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#4AC29A" />
                            <Text style={styles.actionText}>Income</Text>
                        </TouchableOpacity>

                        {/* ✅ ปุ่ม Expense */}
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("AddTransaction", { type: "expense" })}
                        >
                            <Ionicons name="paper-plane-outline" size={24} color="#4AC29A" />
                            <Text style={styles.actionText}>Expense</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "Transactions" && styles.tabActive,
                        ]}
                        onPress={() => setActiveTab("Transactions")}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Transactions" && styles.tabTextActive,
                            ]}
                        >
                            Transactions
                        </Text>
                    </TouchableOpacity>

                    {/* Upcoming Bills Tab */}
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            activeTab === "Upcoming" && styles.tabActive,
                        ]}
                        onPress={() => {
                            setActiveTab("Upcoming");
                            navigation.navigate("WalletUp", { tab: "upcoming" });
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === "Upcoming" && styles.tabTextActive,
                            ]}
                        >
                            Upcoming Bills
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Transactions List */}
                <View style={styles.transactionList}>
                    <View style={styles.transactionItem}>
                        <View>
                            <Text style={styles.transactionTitle}>Shopping</Text>
                            <Text style={styles.transactionDetail}>
                                Shopping Sep 12 2025 11.08 PM
                            </Text>
                            <Text style={styles.transactionDetail}>Method: Cash</Text>
                            <Text style={styles.transactionDetail}>
                                Location: Mahidol University
                            </Text>
                        </View>
                        <Text style={styles.transactionExpense}>-200.00 Bath</Text>
                    </View>

                    <View style={styles.transactionItem}>
                        <View>
                            <Text style={styles.transactionTitle}>Sell Daifuku</Text>
                            <Text style={styles.transactionDetail}>
                                Shopping Sep 12 2025 11.30 PM
                            </Text>
                            <Text style={styles.transactionDetail}>Method: Cash</Text>
                            <Text style={styles.transactionDetail}>
                                Location: Fukujii daifuku
                            </Text>
                        </View>
                        <Text style={styles.transactionIncome}>+500.00 Bath</Text>
                    </View>

                    <View style={styles.transactionItem}>
                        <View>
                            <Text style={styles.transactionTitle}>Dinner</Text>
                            <Text style={styles.transactionDetail}>
                                Shopping Sep 12 2025 11.50 PM
                            </Text>
                            <Text style={styles.transactionDetail}>Method: Cash</Text>
                            <Text style={styles.transactionDetail}>Location: Home</Text>
                        </View>
                        <Text style={styles.transactionExpense}>-100.00 Bath</Text>
                    </View>
                </View>
            </ScrollView>

            {/* ✅ Fixed BottomNav */}
            <LinearGradient
                colors={["#FFFFFF", "#B2EED9"]}
                style={styles.bottomGradient}
            />
            <View style={styles.bottomNavWrapper}>
                <BottomNavBar navigation={navigation} currentRoute={route.name} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        height: 160,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 8,
        marginTop: 20,
    },
    searchPlaceholder: { color: "#636e72", marginLeft: 8 },
    balanceCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: -40,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    balanceLabel: { color: "#636e72", fontSize: 14 },
    balanceValue: { fontSize: 28, fontWeight: "bold", marginVertical: 10 },
    actionRow: { flexDirection: "row", gap: 40, marginTop: 10 },
    actionButton: { alignItems: "center" },
    actionText: { color: "#2d3436", fontSize: 14, marginTop: 4 },

    tabContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        backgroundColor: "#F1F2F6",
        marginHorizontal: 40,
        borderRadius: 25,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 6,
    },
    tabText: { color: "#636e72", fontSize: 14 },
    tabActive: {
        backgroundColor: "#fff",
        borderRadius: 20,
    },
    tabTextActive: { color: "#000", fontWeight: "bold" },

    transactionList: {
        marginTop: 20,
        marginHorizontal: 20,
    },
    transactionItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    transactionTitle: { fontSize: 16, fontWeight: "bold" },
    transactionDetail: { fontSize: 12, color: "#636e72" },
    transactionExpense: { color: "red", fontWeight: "bold" },
    transactionIncome: { color: "green", fontWeight: "bold" },

    bottomGradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        zIndex: -1,
    },
    bottomNavWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
});