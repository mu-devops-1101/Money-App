import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    ScrollView,
    Image,
    TextInput,
    Text,
    TouchableOpacity,
    Alert
} from "react-native";
import { loginUser } from "../services/api"; // ดึงจาก api.js

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Alert.alert("Error", "Please enter email and password");
                return;
            }

            const res = await loginUser({ email, password });

            if (res.status === 200) {
                Alert.alert("Success", "Login successful!");
                navigation.navigate("Home"); // ไปหน้า Home.js
            } else {
                Alert.alert("Error", res.data.message || "Login failed");
            }
        } catch (err) {
            Alert.alert("Error", "Cannot connect to server");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginTop: 21, marginBottom: 358 }}>
                    <View style={{ marginBottom: 8, marginHorizontal: 48 }}>
                        <Image
                            source={{
                                uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/GwyeDrebHg/xcnz10v3_expires_30_days.png"
                            }}
                            resizeMode={"stretch"}
                            style={{
                                height: 236,
                                marginHorizontal: 29
                            }}
                        />
                        <View>
                            <TextInput
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                style={{
                                    color: "#000000",
                                    fontSize: 12,
                                    marginBottom: 19,
                                    backgroundColor: "#F4F4F833",
                                    borderColor: "#F4F4F8",
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    paddingVertical: 17,
                                    paddingLeft: 9,
                                    paddingRight: 18
                                }}
                            />
                            <TextInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={{
                                    color: "#000000",
                                    fontSize: 12,
                                    backgroundColor: "#F4F4F833",
                                    borderColor: "#F4F4F8",
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    paddingVertical: 17,
                                    paddingLeft: 9,
                                    paddingRight: 18
                                }}
                            />
                        </View>
                    </View>

                    <Text
                        style={{
                            color: "#000000",
                            fontSize: 11,
                            fontWeight: "bold",
                            marginBottom: 22,
                            marginLeft: 54
                        }}
                    >
                        forgot password?
                    </Text>

                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            backgroundColor: "#FFFFFF",
                            borderRadius: 28,
                            paddingVertical: 23,
                            marginHorizontal: 45,
                            shadowColor: "#00000040",
                            shadowOpacity: 0.3,
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 8,
                            elevation: 8
                        }}
                        onPress={handleLogin}
                    >
                        <Text
                            style={{
                                color: "#000000",
                                fontSize: 20
                            }}
                        >
                            LOG IN
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
