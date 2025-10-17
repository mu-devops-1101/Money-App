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
    KeyboardAvoidingView,
    Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

// --- Import ไฟล์และ Component ที่จำเป็น ---
import chevronLeft from '../assets/chevron-left.png';
import { BottomNavBar } from './BottomNavBar'; // นำเข้า NavBar

const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    text: '#000000',
    inputBg: 'rgba(255, 255, 255, 0.8)',
    income: '#2ecc71',
    expense: '#e74c3c',
    lightGray: '#f0f0f0',
    gray: '#999',
};

const CATEGORY_OPTIONS = ['shopping', 'food', 'travel', 'pet', 'other'];

export default function AddTransactionScreen({ navigation }) {
    // --- State สำหรับเก็บข้อมูลในฟอร์ม ---
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [otherCategory, setOtherCategory] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- ดึงชื่อ Route ปัจจุบันเพื่อส่งให้ NavBar ---
    const currentRoute = navigation.getState().routes[navigation.getState().index].name;

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = () => {
        const finalCategory = category === 'other' ? otherCategory : category;
        if (!amount || !finalCategory) {
            Alert.alert('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกจำนวนเงินและเลือกหมวดหมู่');
            return;
        }

        setLoading(true);
        const transactionData = {
            type: transactionType,
            amount: parseFloat(amount),
            description: description,
            category: finalCategory,
            date: date.toISOString(),
        };

        console.log("Saving Data:", transactionData);

        setTimeout(() => {
            setLoading(false);
            Alert.alert('บันทึกสำเร็จ!', 'ธุรกรรมของคุณถูกบันทึกแล้ว');
            navigation.goBack();
        }, 1000);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <LinearGradient
                        colors={[COLORS.white, '#DEF9F2', COLORS.primary]}
                        style={styles.linearGradientContainer}
                    >
                        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                            {/* --- Header --- */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                                    <Image source={chevronLeft} style={styles.headerIcon} />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Add Transaction</Text>
                                <View style={{ width: 30 }} />
                            </View>

                            {/* --- Income/Expense Toggle --- */}
                            <View style={styles.typeSelectorContainer}>
                                <TouchableOpacity style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActiveExpense]} onPress={() => setTransactionType('expense')}>
                                    <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>Expense</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActiveIncome]} onPress={() => setTransactionType('income')}>
                                    <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>Income</Text>
                                </TouchableOpacity>
                            </View>

                            {/* --- Form Section --- */}
                            <View style={styles.formContainer}>
                                <Text style={styles.labelText}>Amount</Text>
                                <TextInput style={styles.input} placeholder="0.00" placeholderTextColor={COLORS.gray} keyboardType="numeric" value={amount} onChangeText={setAmount} />

                                <Text style={styles.labelText}>Description</Text>
                                <TextInput style={styles.input} placeholder="e.g., Coffee with friends" placeholderTextColor={COLORS.gray} value={description} onChangeText={setDescription} />

                                <Text style={styles.labelText}>Date / Time</Text>
                                <Pressable onPress={() => setShowDatePicker(true)}>
                                    <TextInput style={styles.input} value={date.toLocaleString('th-TH')} editable={false} />
                                </Pressable>
                                {showDatePicker && <DateTimePicker value={date} mode="datetime" display="default" onChange={onDateChange} />}

                                <Text style={styles.labelText}>Category</Text>
                                <View style={styles.categoryContainer}>
                                    {CATEGORY_OPTIONS.map((item) => (
                                        <TouchableOpacity key={item} style={[styles.categoryChip, category === item && styles.categoryChipActive]} onPress={() => setCategory(item)}>
                                            <Text style={[styles.categoryChipText, category === item && styles.categoryChipTextActive]}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {category === 'other' && <TextInput style={[styles.input, { marginTop: 10 }]} placeholder="Please specify category" placeholderTextColor={COLORS.gray} value={otherCategory} onChangeText={setOtherCategory} />}
                            </View>

                            {/* --- Save Button --- */}
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                                <Text style={styles.saveButtonText}>{loading ? 'SAVING...' : 'SAVE TRANSACTION'}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </LinearGradient>
                </KeyboardAvoidingView>

                {/* --- Bottom Navigation Bar --- */}
                <BottomNavBar navigation={navigation} currentRoute={currentRoute} />
            </View>
        </SafeAreaView>
    );
};

// --- Styles ---
const styles = StyleSheet.create({
    linearGradientContainer: { flex: 1 },
    scrollViewContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
    header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
    headerButton: { padding: 5 },
    headerIcon: { width: 30, height: 30 },
    headerTitle: { fontWeight: 'bold', color: COLORS.dark, fontSize: 22 },
    typeSelectorContainer: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 25, marginBottom: 30 },
    typeButton: { flex: 1, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
    typeButtonActiveExpense: { backgroundColor: COLORS.expense },
    typeButtonActiveIncome: { backgroundColor: COLORS.income },
    typeButtonText: { color: COLORS.dark, fontSize: 16, fontWeight: '600' },
    typeButtonTextActive: { color: COLORS.white },
    formContainer: { width: '100%', backgroundColor: COLORS.inputBg, borderRadius: 20, padding: 20, marginBottom: 30 },
    labelText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
    input: { backgroundColor: COLORS.white, borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ddd', color: '#000' },
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
    categoryChip: { backgroundColor: COLORS.lightGray, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
    categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    categoryChipText: { color: COLORS.dark, fontWeight: '500' },
    categoryChipTextActive: { color: COLORS.white },
    saveButton: { width: '100%', backgroundColor: COLORS.dark, paddingVertical: 18, borderRadius: 30, alignItems: 'center', elevation: 5 },
    saveButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});