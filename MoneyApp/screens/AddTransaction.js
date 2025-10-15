import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    Alert,
    Platform,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// --- Import รูปภาพจาก assets (แนะนำให้ใช้ .png จะดีกว่า .jpg) ---
import chevronLeft from '../assets/chevron-left.jpg';

const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    text: '#000000',
    inputBg: 'rgba(255, 255, 255, 0.8)',
    income: '#2ecc71',
    expense: '#e74c3c',
};

// เปลี่ยนชื่อ Component ให้นิยมใช้ (ตัวพิมพ์ใหญ่ทั้งหมด)
export default function AddTransactionScreen({ navigation }) {
    // --- Form States ---
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Save Handler ---
    const handleSave = () => {
        if (!amount || !category) {
            Alert.alert('Incomplete Data', 'Please enter an amount and category.');
            return;
        }
        setLoading(true);
        console.log({
            type: transactionType,
            amount: parseFloat(amount),
            category: category,
            note: note,
        });
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success!', `Transaction saved:\nAmount: ${amount}\nCategory: ${category}`);
            navigation.goBack();
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient
                colors={[COLORS.white, '#DEF9F2', COLORS.primary]}
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>

                        {/* --- ส่วน Header --- */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                                <Image source={chevronLeft} style={styles.headerIcon} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Add Transaction</Text>
                            <View style={{ width: 30 }} />
                        </View>

                        {/* --- Income/Expense Toggle --- */}
                        <View style={styles.typeSelectorContainer}>
                            <TouchableOpacity
                                style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActiveExpense]}
                                onPress={() => setTransactionType('expense')}
                            >
                                <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActiveIncome]}
                                onPress={() => setTransactionType('income')}
                            >
                                <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>Income</Text>
                            </TouchableOpacity>
                        </View>

                        {/* --- Form Section --- */}
                        <View style={styles.formContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.labelText}>Amount</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />

                            <View style={styles.labelContainer}>
                                <Text style={styles.labelText}>Category</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Food, Transport"
                                placeholderTextColor="#999"
                                value={category}
                                onChangeText={setCategory}
                            />

                            <View style={styles.labelContainer}>
                                <Text style={styles.labelText}>Note (Optional)</Text>
                            </View>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="e.g., Lunch with friends"
                                placeholderTextColor="#999"
                                value={note}
                                onChangeText={setNote}
                                multiline={true}
                            />
                        </View>

                        {/* --- Save Button --- */}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                            <Text style={styles.saveButtonText}>{loading ? 'SAVING...' : 'SAVE TRANSACTION'}</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    scrollViewContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    headerButton: { padding: 5 },
    headerIcon: { width: 30, height: 30 },
    headerTitle: { fontWeight: 'bold', color: COLORS.dark, fontSize: 22 },
    typeSelectorContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 25,
        marginBottom: 30,
    },
    typeButton: { flex: 1, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
    typeButtonActiveExpense: { backgroundColor: COLORS.expense },
    typeButtonActiveIncome: { backgroundColor: COLORS.income },
    // ✅ แก้ไข fontWeight เป็น string
    typeButtonText: { color: COLORS.dark, fontSize: 16, fontWeight: '600' },
    typeButtonTextActive: { color: COLORS.white },
    formContainer: {
        width: '100%',
        backgroundColor: COLORS.inputBg,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 1,
        marginBottom: 30,
    },
    labelContainer: {
        marginBottom: 8, // Layout style อยู่ที่ View ที่ครอบ
    },
    // ✅ แก้ไข fontWeight เป็น string และเอา layout style ออก
    labelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        color: '#000',
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    saveButton: {
        width: '100%',
        backgroundColor: COLORS.dark,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});