import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

// --- นำเข้า Component และฟังก์ชัน API ---
import { BottomNavBar } from './BottomNavBar';
import { getUserProfile, getMonthlySummary, getTransactions, setAuthToken } from '../services/api';

// --- กำหนดค่าสีกลาง ---
const COLORS = {
    primary: '#5AC5A9',
    dark: '#363636',
    white: '#FFFFFF',
    textSecondary: '#666',
    income: '#2ecc71',
    expense: '#e74c3c',
    cardBackground: 'rgba(255, 255, 255, 0.9)',
    error: '#e74c3c',
};

// --- Component ย่อย: ส่วนหัวต้อนรับ ---
const WelcomeHeader = ({ user }) => (
    <View style={styles.headerContainer}>
        <View>
            <Text style={styles.welcomeText}>Welcome back!!</Text>
            <Text style={styles.userNameText}>{user ? user.username : 'Loading...'}</Text>
        </View>
    </View>
);

// --- Component ย่อย: การ์ดสรุปยอดเงิน ---
const BalanceSummary = ({ summary }) => {
    const formatCurrency = (num) => num != null ? num.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00';
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={styles.balanceAmount}>฿{formatCurrency(summary?.balance)}</Text>
            <View style={styles.incomeExpenseContainer}>
                <View style={styles.incomeBox}>
                    <Text style={styles.incomeExpenseLabel}>Total Income</Text>
                    <Text style={[styles.incomeExpenseAmount, { color: COLORS.income }]}>
                        + ฿{formatCurrency(summary?.totalIncome)}
                    </Text>
                </View>
                <View style={styles.expenseBox}>
                    <Text style={styles.incomeExpenseLabel}>Total Expense</Text>
                    <Text style={[styles.incomeExpenseAmount, { color: COLORS.expense }]}>
                        - ฿{formatCurrency(summary?.totalExpenses)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

// --- Component ย่อย: รายการธุรกรรมแต่ละอัน ---
const TransactionItem = ({ item }) => {
    const isIncome = item.type === 'income';
    return (
        <TouchableOpacity style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{item.description || item.category}</Text>
                <Text style={styles.transactionDate}>
                    {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Text>
            </View>
            <Text style={[styles.transactionAmount, isIncome ? styles.incomeText : styles.expenseText]}>
                {isIncome ? '+' : '-'} ฿{item.amount.toFixed(2)}
            </Text>
        </TouchableOpacity>
    );
};

// --- หน้า Home หลัก ---
export default function HomeScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // ✅ 1. โหลด token จาก AsyncStorage
            const token = await AsyncStorage.getItem('token');
            console.log("🔑 Token from storage:", token ? token.substring(0, 30) + "..." : "null");

            if (!token) {
                console.error("❌ No token found, redirecting to login...");
                Alert.alert(
                    "กรุณาเข้าสู่ระบบ",
                    "ไม่พบข้อมูลการเข้าสู่ระบบ",
                    [{
                        text: "OK",
                        onPress: () => navigation.navigate("GetStarted")
                    }]
                );
                return;
            }

            // ✅ 2. Set token ให้ axios ใช้
            setAuthToken(token);
            console.log("✅ Token set to axios");

            // ✅ 3. ดึงข้อมูลทั้ง 3 ส่วน
            const now = new Date();
            console.log("📡 Fetching data...");

            const [userRes, summaryRes, transactionsRes] = await Promise.all([
                getUserProfile(),
                getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
                getTransactions()
            ]);

            console.log("✅ Data fetched successfully");

            // ✅ 4. อัปเดต State
            setUser(userRes.data);
            setSummary(summaryRes.data);
            setTransactions(transactionsRes.data);

        } catch (err) {
            console.error("❌ Failed to fetch home screen data:", err);
            console.error("❌ Error response:", err.response?.data);
            console.error("❌ Error status:", err.response?.status);

            // ✅ 5. จัดการ error ตามประเภท
            if (err.response?.status === 401 || err.response?.status === 403) {
                // Token หมดอายุหรือไม่ถูกต้อง
                Alert.alert(
                    "Session หมดอายุ",
                    "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
                    [{
                        text: "OK",
                        onPress: async () => {
                            await AsyncStorage.removeItem('token');
                            navigation.navigate("GetStarted");
                        }
                    }]
                );
            } else {
                // Error อื่นๆ
                setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ✅ ดึง current route name อย่างปลอดภัย
    const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name || 'Home';

    // --- ส่วนแสดงผลตามสถานะ ---

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                    <Text style={styles.retryButtonText}>ลองอีกครั้ง</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#363636', '#5AC5A9']}
                style={styles.gradientBackground}
            >
                <View style={{ flex: 1 }}>
                    <FlatList
                        ListHeaderComponent={
                            <>
                                <WelcomeHeader user={user} />
                                <BalanceSummary summary={summary} />
                                <Text style={styles.listHeader}>All Transactions</Text>
                            </>
                        }
                        data={transactions}
                        renderItem={({ item }) => <TransactionItem item={item} />}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีรายการธุรกรรม</Text>}
                    />
                </View>
                <BottomNavBar navigation={navigation} currentRoute={currentRoute} />
            </LinearGradient>
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.dark },
    gradientBackground: { flex: 1 },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark
    },
    loadingText: {
        color: COLORS.white,
        marginTop: 10,
        fontSize: 16
    },
    listContainer: { paddingHorizontal: 24, paddingBottom: 20 },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.white,
        marginTop: 20,
        marginBottom: 10
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20
    },
    welcomeText: { fontSize: 16, color: COLORS.white },
    userNameText: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
    summaryCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20
    },
    balanceLabel: { fontSize: 16, color: COLORS.dark },
    balanceAmount: { fontSize: 36, fontWeight: 'bold', color: COLORS.dark, marginVertical: 5 },
    incomeExpenseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    incomeBox: { alignItems: 'flex-start' },
    expenseBox: { alignItems: 'flex-end' },
    incomeExpenseLabel: { fontSize: 14, color: '#555' },
    incomeExpenseAmount: { fontSize: 18, fontWeight: '600' },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        padding: 15,
        borderRadius: 12,
        marginBottom: 10
    },
    transactionDetails: { flex: 1 },
    transactionDescription: { fontSize: 16, fontWeight: '500', color: COLORS.dark },
    transactionDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
    transactionAmount: { fontSize: 16, fontWeight: 'bold' },
    incomeText: { color: COLORS.income },
    expenseText: { color: COLORS.expense },
    emptyText: { color: COLORS.white, textAlign: 'center', marginTop: 20 },
    errorText: {
        color: COLORS.white,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    retryButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20
    },
    retryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
});