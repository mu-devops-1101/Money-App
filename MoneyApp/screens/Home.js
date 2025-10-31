import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


// --- นำเข้า Component และฟังก์ชัน API ---
import { BottomNavBar } from './BottomNavBar';
import { getUserProfile, getMonthlySummary, getTransactions } from '../services/api';

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
        <TouchableOpacity onPress={() => { /* TODO: Navigate to Profile */ }}>
            <Image
                source={require('../assets/Profile-image.png')} // ต้องมีรูปนี้ใน assets
                style={styles.profileImage}
            />
        </TouchableOpacity>
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
                {isIncome ? '+' : '-'} {item.amount.toFixed(2)}
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
    const [error, setError] = useState(null); // 👈 เพิ่ม State สำหรับจัดการ Error

    const fetchData = async () => {
        setLoading(true); // เริ่มโหลดใหม่ทุกครั้งที่เรียก
        setError(null);   // ล้าง Error เก่าทิ้ง
        try {
            const now = new Date();
            // ดึงข้อมูลทั้ง 3 ส่วนพร้อมกัน
            const [userRes, summaryRes, transactionsRes] = await Promise.all([
                getUserProfile(),
                getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
                getTransactions()
            ]);
            // อัปเดต State เมื่อดึงข้อมูลสำเร็จ
            setUser(userRes.data);
            setSummary(summaryRes.data);
            setTransactions(transactionsRes.data);
        } catch (err) {
            console.error("Failed to fetch home screen data:", err);
            setError("Failed to load data. Please try again."); // 👈 ตั้งค่า Error message
        } finally {
            setLoading(false); // 👈 หยุดโหลดเสมอ ไม่ว่าจะสำเร็จหรือล้มเหลว
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const currentRoute = navigation.getState().routes[navigation.getState().index].name;

    // --- ส่วนแสดงผลตามสถานะ ---

    if (loading) {
        return <View style={styles.centerContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
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
                        // เพิ่มข้อความเมื่อไม่มีข้อมูล
                        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
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
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary },
    listContainer: { paddingHorizontal: 24, paddingBottom: 20 },
    listHeader: { fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginTop: 20, marginBottom: 10 },
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 20 },
    welcomeText: { fontSize: 16, color: COLORS.white },
    userNameText: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
    profileImage: { width: 66, height: 66, borderRadius: 33, borderWidth: 2, borderColor: COLORS.white },
    summaryCard: { backgroundColor: COLORS.cardBackground, borderRadius: 20, padding: 20, marginBottom: 20 },
    balanceLabel: { fontSize: 16, color: COLORS.dark },
    balanceAmount: { fontSize: 36, fontWeight: 'bold', color: COLORS.dark, marginVertical: 5 },
    incomeExpenseContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    incomeBox: { alignItems: 'flex-start' },
    expenseBox: { alignItems: 'flex-end' },
    incomeExpenseLabel: { fontSize: 14, color: '#555' },
    incomeExpenseAmount: { fontSize: 18, fontWeight: '600' },
    transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.cardBackground, padding: 15, borderRadius: 12, marginBottom: 10 },
    transactionDetails: { flex: 1 },
    transactionDescription: { fontSize: 16, fontWeight: '500', color: COLORS.dark },
    transactionDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
    transactionAmount: { fontSize: 16, fontWeight: 'bold' },
    incomeText: { color: COLORS.income },
    expenseText: { color: COLORS.expense },
    emptyText: { color: COLORS.white, textAlign: 'center', marginTop: 20 },
    // Error Styles
    errorText: { color: COLORS.white, fontSize: 18, textAlign: 'center', marginBottom: 20 },
    retryButton: { backgroundColor: COLORS.white, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20 },
    retryButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' },
});