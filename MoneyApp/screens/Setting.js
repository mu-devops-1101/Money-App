import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BottomNavBar } from "./BottomNavBar";

export default function Setting() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ ScrollView สำหรับเนื้อหาที่ยาว */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }} // กันไม่ให้เนื้อหาถูก navbar ทับ
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Setting</Text>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/Profile-image.png")}
            style={styles.profileImage}
          />
          <Text style={styles.username}>Wednesday_Addams</Text>
        </View>

        {/* Options */}
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Profile")}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="person-circle-outline" size={22} color="#5ac5a9" />
              <Text style={styles.optionText}>Edit Profile Information</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#636e72" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="key-outline" size={22} color="#5ac5a9" />
              <Text style={styles.optionText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#636e72" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="trash-outline" size={22} color="#d63031" />
              <Text style={[styles.optionText, { color: "#d63031" }]}>
                Delete or Deactivate Account
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={20} color="#636e72" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Gradient Background */}
      <LinearGradient
        colors={["#FFFFFF", "#B2EED9"]}
        style={styles.bottomGradient}
      />

      {/* ✅ Bottom Navigation (fixed ติดล่าง) */}
      <View style={styles.bottomNavWrapper}>
        <BottomNavBar navigation={navigation} currentRoute={route.name} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 16,
    color: "#b2bec3",
    marginTop: 10,
    marginLeft: 15,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  username: {
    fontWeight: "600",
    marginTop: 8,
    fontSize: 16,
  },
  optionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 0.8,
    borderBottomColor: "#dfe6e9",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#2d3436",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: -1,
  },
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
