import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Text,
    Alert
} from "react-native";
import { registerUser } from "../services/api"; // ดึงจาก api.js

export default function Register({ navigation }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleRegister = async () => {
        if (!username || !password || !confirmPassword || !email) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const res = await registerUser({ username, password, email });

            if (res.status === 201) {
                Alert.alert("Success", "Registration successful!");
                navigation.navigate("Login"); // กลับไปหน้า Login
            } else {
                Alert.alert("Error", res.data.message || "Registration failed");
            }
        } catch (err) {
            Alert.alert("Error", "Cannot connect to server");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 45 }}>
                <View
                    style={{
                        backgroundColor: "#FEFEFE",
                        borderRadius: 36,
                        paddingTop: 1,
                        paddingHorizontal: 1,
                        marginTop: 166,
                        marginBottom: 24
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#5AC5A9",
                            borderRadius: 36,
                            paddingVertical: 22,
                            paddingHorizontal: 21
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 36,
                                paddingVertical: 36,
                                paddingHorizontal: 34
                            }}
                        >
                            <Image
                                source={{
                                    uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/GwyeDrebHg/7u6dra7j_expires_30_days.png"
                                }}
                                resizeMode={"stretch"}
                                style={{
                                    width: 33,
                                    height: 27
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Username */}
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={{
                        color: "#000",
                        fontSize: 12,
                        marginBottom: 25,
                        backgroundColor: "#F4F4F833",
                        borderColor: "#F4F4F8",
                        borderRadius: 12,
                        borderWidth: 1,
                        paddingVertical: 17,
                        paddingLeft: 10,
                        paddingRight: 20
                    }}
                />

                {/* Password */}
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{
                        color: "#000",
                        fontSize: 12,
                        marginBottom: 25,
                        backgroundColor: "#F4F4F833",
                        borderColor: "#F4F4F8",
                        borderRadius: 12,
                        borderWidth: 1,
                        paddingVertical: 17,
                        paddingLeft: 10,
                        paddingRight: 20
                    }}
                />

                {/* Confirm Password */}
                <TextInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={{
                        color: "#000",
                        fontSize: 12,
                        marginBottom: 25,
                        backgroundColor: "#F4F4F833",
                        borderColor: "#F4F4F8",
                        borderRadius: 12,
                        borderWidth: 1,
                        paddingVertical: 17,
                        paddingLeft: 10,
                        paddingRight: 20
                    }}
                />

                {/* Email */}
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={{
                        color: "#000",
                        fontSize: 12,
                        backgroundColor: "#F4F4F833",
                        borderColor: "#F4F4F8",
                        borderRadius: 12,
                        borderWidth: 1,
                        paddingVertical: 17,
                        paddingLeft: 10,
                        paddingRight: 20
                    }}
                />

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={{
                        alignSelf: "stretch",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 28,
                        paddingVertical: 23,
                        marginTop: 40,
                        shadowColor: "#00000040",
                        shadowOpacity: 0.3,
                        shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 8,
                        elevation: 8
                    }}
                    onPress={handleRegister}
                >
                    <Text
                        style={{
                            color: "#000000",
                            fontSize: 20
                        }}
                    >
                        SIGN UP
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
