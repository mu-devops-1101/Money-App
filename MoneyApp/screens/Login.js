import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Platform // เพิ่ม Platform เพื่อจัดการเงา
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../services/api";

// 1. นำเข้าสีจากที่เดียวกันกับ GetStarted หรือกำหนดตรงนี้
// (แนะนำให้สร้างไฟล์ centralize colors เช่น constants/colors.js แล้ว import มาใช้)
const COLORS = {
    primary: '#5ac5a9',
    dark: '#363636',
    white: '#FFFFFF',
    lightGrey: '#F2F2F2',
    textGrey: '#999999', // สีเทาสำหรับ placeholder/ข้อความ
};

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading

    const handleLogin = async () => {
        // ... (ส่วนตรวจสอบข้อมูล) ...

        setLoading(true);
        try {
            const credentials = { email, password };

            const res = await loginUser(credentials);

            // 1. ตรวจสอบสถานะ (Login สำเร็จคาดหวัง 200 OK)
            if (res.status === 200) {
                // *** สำคัญมาก: ต้องบันทึก Token ที่ Backend ส่งกลับมา ***
                const token = res.data.token; // สมมติว่า Backend ส่ง token มาใน 'token' field

                if(token) {
                    // 2. บันทึก Token ใน API Service เพื่อใช้กับ API อื่นๆ
                    // setToken(token); // ต้องสร้าง setToken ใน api.js

                    Alert.alert("Success", "Login successful!");
                    // 3. สั่งนำทาง
                    navigation.navigate("Home");
                } else {
                    Alert.alert("Error", "Login failed: Missing token.");
                }
            } else {
                // กรณี Backend ตอบกลับมาด้วย status อื่นที่ไม่ใช่ 200
                Alert.alert("Error", res.data.message || "Login failed.");
            }
        } catch (err) {
            // จัดการ Network Error หรือ 4xx/5xx status codes
            const errorMessage = err.response?.data?.message || "Cannot connect to server or invalid credentials.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[COLORS.dark, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.contentWrapper}>
                        {/* โลโก้ */}
                        <Image
                            source={{
                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/GwyeDrebHg/xcnz10v3_expires_30_days.png" // เปลี่ยนเป็นรูปใน assets ของคุณดีกว่า
                            }}
                            resizeMode={"contain"} // ใช้ 'contain' เพื่อให้รูปภาพไม่ถูกบีบ
                            style={styles.logo}
                        />

                        {/* หัวข้อ */}
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue to your account.</Text>

                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder="Email Address"
                                placeholderTextColor={COLORS.textGrey}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.textInput}
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={COLORS.textGrey}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.textInput}
                            />
                        </View>

                        {/* Forgot password */}
                        <TouchableOpacity style={styles.forgotPasswordButton}>
                            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading} // ปิดการใช้งานปุ่มขณะโหลด
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? "Logging in..." : "LOG IN"}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign up prompt */}
                        <View style={styles.signUpPrompt}>
                            <Text style={styles.signUpText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.signUpLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1, // ทำให้ ScrollView สามารถขยายเต็มพื้นที่ได้
        justifyContent: 'center', // จัดเนื้อหาให้อยู่ตรงกลางแนวตั้ง
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 25,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 400, // จำกัดความกว้างสูงสุดสำหรับหน้าจอใหญ่
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30, // ลดระยะห่างด้านล่างของโลโก้
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.lightGrey,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    textInput: {
        backgroundColor: `${COLORS.white}33`, // ใช้ white ที่มีความโปร่งใส
        color: COLORS.white, // สีของข้อความใน input
        fontSize: 16,
        borderRadius: 12,
        paddingVertical: Platform.OS === 'ios' ? 15 : 12, // ปรับ padding ตาม OS
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: `${COLORS.white}66`, // สีขอบ input
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end', // จัดให้อยู่ชิดขวา
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    loginButton: {
        width: "100%",
        height: 55,
        backgroundColor: COLORS.white,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        ...Platform.select({ // เพิ่มเงา
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
        marginBottom: 20,
    },
    loginButtonText: {
        color: COLORS.dark, // สีตัวอักษรของปุ่ม login
        fontSize: 18,
        fontWeight: "bold",
    },
    signUpPrompt: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    signUpText: {
        color: COLORS.lightGrey,
        fontSize: 14,
    },
    signUpLink: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});