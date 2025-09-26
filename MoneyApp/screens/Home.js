import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getMonthlySummary } from "../services/api";

export default function Home() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const loadSummary = async () => {
            const now = new Date();
            const res = await getMonthlySummary(now.getFullYear(), now.getMonth() + 1);
            if (res.status === 200) {
                setSummary(res.data);
            }
        };
        loadSummary();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Monthly Summary</Text>
            {summary ? (
                <>
                    <Text>Total Income: {summary.totalIncome}</Text>
                    <Text>Total Expenses: {summary.totalExpenses}</Text>
                    <Text>Balance: {summary.balance}</Text>
                </>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
