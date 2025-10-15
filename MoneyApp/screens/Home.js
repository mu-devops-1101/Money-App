import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, ActivityIndicator, TouchableOpacity } from "react-native";
import { getMonthlySummary } from "../services/api";

// 1. (แนะนำ) สร้าง Object สีไว้ข้างนอก ทำให้จัดการธีมสีง่าย
const COLORS = {
    background: '#f4f7f9',
    webBackground: '#e8eff3',
    card: '#ffffff',
    textPrimary: '#333',
    textSecondary: '#666',
    income: '#2ecc71',
    expense: '#e74c3c',
    balance: '#3498db',
    error: '#e74c3c',
    divider: '#e0e0e0',
};

export default function Home({ navigation }) { // เพิ่ม navigation เข้ามา
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // 2. ใช้ state 'loading' โดยเฉพาะ

    // 3. (แนะนำ) แยกฟังก์ชันโหลดข้อมูลออกมา ทำให้เรียกใช้ซ้ำได้
    const loadSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const res = await getMonthlySummary(year, month);
            if (res && res.data) {
                setSummary(res.data);
            } else {
                setError("Could not retrieve summary data.");
            }
        } catch (err) {
            console.error("Failed to fetch summary:", err);
            setError("An error occurred while fetching data.");
        } finally {
            setLoading(false); // หยุดโหลดเสมอไม่ว่าจะสำเร็จหรือล้มเหลว
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    // ฟังก์ชันสำหรับแสดงผลตัวเลขให้สวยงาม (เหมือนเดิม)
    const formatCurrency = (number) => {
        if (typeof number !== 'number') return '0'; // ป้องกัน error ถ้าข้อมูลไม่ใช่ตัวเลข
        return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number);
    };

    // 4. สร้าง Component ย่อยสำหรับแต่ละสถานะ (Loading, Error, Content)
    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator size="large" color={COLORS.primary} />;
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadSummary}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (summary) {
            return (
                <View style={styles.summaryBox}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Income:</Text>
                        <Text style={[styles.summaryValue, styles.incomeText]}>
                            + {formatCurrency(summary.totalIncome)}
                        </Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Expenses:</Text>
                        <Text style={[styles.summaryValue, styles.expenseText]}>
                            - {formatCurrency(summary.totalExpenses)}
                        </Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, styles.balanceLabel]}>Balance:</Text>
                        <Text style={[styles.summaryValue, styles.balanceValue]}>
                            {formatCurrency(summary.balance)}
                        </Text>
                    </View>
                </View>
            );
        }

        return null; // กรณีที่ไม่มีข้อมูลใดๆ
    };

    return (
        <View style={[styles.container, Platform.select({ web: styles.webContainer })]}>
            <Text style={styles.title}>Monthly Summary</Text>
            {renderContent()}
            {/* 5. เพิ่มปุ่ม Call-to-Action */}
            {!loading && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("AddTransaction")} // ไปยังหน้าเพิ่ม Transaction
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    webContainer: {
        backgroundColor: COLORS.webBackground,
        height: '100vh',
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: COLORS.textPrimary,
    },
    summaryBox: {
        padding: 20,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        width: '85%',
        maxWidth: 400,
        ...Platform.select({ // ปรับปรุงเงา
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 5,
            }
        }),
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    incomeText: { color: COLORS.income },
    expenseText: { color: COLORS.expense },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 12,
    },
    balanceLabel: { fontWeight: 'bold', fontSize: 18, color: COLORS.textPrimary },
    balanceValue: { fontWeight: 'bold', fontSize: 20, color: COLORS.balance },
    errorContainer: { // สไตล์สำหรับส่วนแสดง Error
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: { // ปุ่มสำหรับลองใหม่
        backgroundColor: COLORS.balance,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
    retryButtonText: {
        color: COLORS.card,
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: { // สไตล์สำหรับปุ่ม +
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.balance,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({ // เงาสำหรับปุ่ม +
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            }
        }),
    },
    addButtonText: {
        color: COLORS.card,
        fontSize: 32,
        lineHeight: 36,
    }
});