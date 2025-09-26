import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';


export default function Home({ navigation }) {
    // Mock data → ภายหลังคุณสามารถเชื่อมจาก DB ได้
    const [balance, setBalance] = useState(5500);
    const [income, setIncome] = useState(6000);
    const [expense, setExpense] = useState(500);
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            title: "Shopping",
            amount: -200,
            method: "Cash",
            location: "Mahidol University",
            date: "Sep 12 2025 11.08 PM",
        },
        {
            id: 2,
            title: "Sell Daifuku",
            amount: 500,
            method: "Cash",
            location: "Fukuji daifuku",
            date: "Sep 12 2025 11.30 PM",
        },
        {
            id: 3,
            title: "Dinner",
            amount: -100,
            method: "Cash",
            location: "-",
            date: "Sep 12 2025 12.30 PM",
        },
    ]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Balance Card */}
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#7A51FF", "#19FFD8"]}
                    style={styles.balanceCard}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.balanceText}>฿{balance.toFixed(2)}</Text>
                        <Text style={styles.subText}>Balance</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("AddExIn")}
                        style={styles.addButton}
                    >
                        <Text style={{ color: "#fff", fontSize: 28 }}>+</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Income & Expense */}
                <View style={styles.row}>
                    <LinearGradient
                        colors={["#0399AF", "#6DE943"]}
                        style={styles.smallCard}
                    >
                        <Text style={styles.smallCardTitle}>Total Income</Text>
                        <Text style={styles.smallCardValue}>฿{income.toFixed(2)}</Text>
                    </LinearGradient>

                    <LinearGradient
                        colors={["#FF282C", "#7152FF"]}
                        style={styles.smallCard}
                    >
                        <Text style={styles.smallCardTitle}>Total Expense</Text>
                        <Text style={styles.smallCardValue}>฿{expense.toFixed(2)}</Text>
                    </LinearGradient>
                </View>

                {/* Transaction List */}
                <Text style={styles.sectionTitle}>All Transactions</Text>
                {transactions.map((tx) => (
                    <View key={tx.id} style={styles.transactionCard}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.txTitle}>{tx.title}</Text>
                            <Text
                                style={[
                                    styles.txAmount,
                                    { color: tx.amount > 0 ? "#00D01F" : "#FF0000" },
                                ]}
                            >
                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Bath
                            </Text>
                        </View>
                        <Text style={styles.txDetail}>
                            {tx.title} • {tx.date}
                        </Text>
                        <Text style={styles.txDetail}>Method: {tx.method}</Text>
                        <Text style={styles.txDetail}>Location: {tx.location}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
    },
    balanceCard: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 20,
        marginVertical: 20,
    },
    balanceText: {
        color: "#FFFFFF",
        fontSize: 32,
        fontWeight: "bold",
    },
    subText: {
        color: "#FFFFFF",
        fontSize: 14,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#00000055",
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    smallCard: {
        flex: 1,
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 5,
    },
    smallCardTitle: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    smallCardValue: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    sectionTitle: {
        color: "#000000",
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 15,
    },
    transactionCard: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        marginBottom: 12,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    txTitle: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "bold",
    },
    txAmount: {
        fontSize: 16,
        fontWeight: "bold",
    },
    txDetail: {
        color: "#333",
        fontSize: 12,
        marginTop: 2,
    },
});
