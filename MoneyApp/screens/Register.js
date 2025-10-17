import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    Alert,
    StyleSheet
} from "react-native";
import { registerUser } from "../services/api"; //

export default function Register({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword || !email) {
            Alert.alert("ข้อมูลไม่ครบถ้วน", "กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("รหัสผ่านไม่ตรงกัน", "กรุณายืนยันรหัสผ่านให้ถูกต้อง");
            return;
        }

        setLoading(true);
        try {
            const userData = {
                username: username,
                password: password,
                role: "ROLE_USER"
            };

            console.log("ส่งข้อมูลไป Backend:", JSON.stringify(userData));

            const res = await registerUser(userData);
            console.log("Backend response:", res.data);

            // ✅ Backend ตอบกลับด้วย status 200 และข้อความเป็น string
            if (res.status === 200 && typeof res.data === "string") {
                Alert.alert("ลงทะเบียนสำเร็จ!", "กรุณาเข้าสู่ระบบเพื่อใช้งาน");
                navigation.navigate("Login");
            } else {
                Alert.alert("เกิดข้อผิดพลาด", res.data?.message || "ไม่สามารถสมัครสมาชิกได้");
            }

        } catch (err) {
            const errorMessage =
                err.response?.data || err.message || "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";
            Alert.alert("เกิดข้อผิดพลาด", errorMessage.toString());
            console.error("Register error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <View style={styles.logoInnerCircle}>
                            <Image
                                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/GwyeDrebHg/7u6dra7j_expires_30_days.png" }}
                                resizeMode={"contain"}
                                style={styles.logoImage}
                            />
                        </View>
                    </View>
                </View>

                {/* --- Input Fields --- */}
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />

                {/* --- Sign Up Button --- */}
                <TouchableOpacity style={styles.signUpButton} onPress={handleRegister} disabled={loading}>
                    <Text style={styles.signUpButtonText}>
                        {loading ? 'กำลังสร้างบัญชี...' : 'SIGN UP'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
    scrollViewContent: { paddingHorizontal: 45, paddingBottom: 50 },
    logoContainer: { backgroundColor: "#FEFEFE", borderRadius: 36, padding: 1, marginTop: 100, marginBottom: 40, alignSelf: 'center' },
    logoBackground: { backgroundColor: "#5AC5A9", borderRadius: 36, padding: 21 },
    logoInnerCircle: { backgroundColor: "#FFFFFF", borderRadius: 36, padding: 34, justifyContent: 'center', alignItems: 'center' },
    logoImage: { width: 33, height: 27 },
    input: { color: "#000", fontSize: 14, marginBottom: 20, backgroundColor: "#F4F4F8", borderRadius: 12, borderWidth: 1, borderColor: "#E8E8E8", paddingVertical: 15, paddingHorizontal: 15 },
    signUpButton: { alignItems: "center", backgroundColor: "#5AC5A9", borderRadius: 28, paddingVertical: 18, marginTop: 20, boxShadow: "0px 2px 4px rgba(0,0,0,0.25)",},
    signUpButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: 'bold' },
});