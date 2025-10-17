import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function WalletUp() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#4AC29A", "#BDFFF3"]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Wallet")}>
            <Ionicons name="arrow-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upcoming Bills</Text>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Netflix Subscription</Text>
          <Text style={styles.cardDetail}>Due: Oct 25, 2025</Text>
          <Text style={styles.cardDetail}>Amount: ฿450.00</Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => alert("Bill paid!")}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Electricity Bill</Text>
          <Text style={styles.cardDetail}>Due: Oct 28, 2025</Text>
          <Text style={styles.cardDetail}>Amount: ฿980.00</Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => alert("Bill paid!")}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ ปุ่มไปหน้า ThisMonth */}
      <TouchableOpacity
        style={styles.thisMonthButton}
        onPress={() => navigation.navigate("ThisMonth")}
      >
        <Text style={styles.thisMonthText}>View This Month Summary</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardDetail: { fontSize: 13, color: "#636e72", marginTop: 4 },
  payButton: {
    backgroundColor: "#4AC29A",
    paddingVertical: 8,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontWeight: "bold" },

  thisMonthButton: {
    backgroundColor: "#2ecc71",
    margin: 20,
    borderRadius: 15,
    alignItems: "center",
    paddingVertical: 12,
  },
  thisMonthText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
});
