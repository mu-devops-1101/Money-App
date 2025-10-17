import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ThisMonthScreen() {
  const navigation = useNavigation();

  // ข้อมูลกราฟ
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [10000, 15000, 12000, 18000, 14000, 23000],
        color: () => '#6C63FF',
      },
      {
        data: [12000, 13000, 16000, 20000, 19000, 23500],
        color: () => '#FF5252',
      },
      {
        data: [8000, 9000, 8500, 9500, 8700, 9100],
        color: () => '#FDCB6E',
      },
    ],
    legend: ['Income', 'Outcome', 'Savings'],
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/chevron-left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Statistics</Text>
        <Image source={require('../assets/Profile-image.png')} style={styles.profileImage} />
      </View>

      {/* Graph Section */}
      <View style={styles.graphContainer}>
        <LineChart
          data={data}
          width={screenWidth - 30}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#E8F4F8',
            backgroundGradientTo: '#E8F4F8',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => '#666',
            strokeWidth: 2,
            propsForDots: { r: '3', strokeWidth: '2' },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Monthly budget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly budget</Text>
        <Text style={styles.budgetText}>฿ 580 / 8820</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill}></View>
        </View>
        <Text style={styles.dailyText}>Daily budget was ฿826.45 - ฿45.33, Saved ฿340</Text>
      </View>

      {/* Most of money goes to */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Most of money goes to</Text>

        <View style={styles.expenseCard}>
          <View style={styles.iconBox}></View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseName}>House</Text>
            <Text style={styles.expensePercent}>45%</Text>
          </View>
          <Text style={styles.expenseAmount}>-฿232.00</Text>
        </View>

        <View style={[styles.expenseCard, { borderLeftColor: '#FFB703' }]}>
          <View style={styles.iconBox}></View>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseName}>Car</Text>
            <Text style={styles.expensePercent}>20%</Text>
          </View>
          <Text style={styles.expenseAmount}>-฿170.00</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#C6E7E2',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  graphContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chart: {
    borderRadius: 10,
  },

  section: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  budgetText: {
    fontSize: 16,
    color: '#3A3A3A',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginVertical: 8,
  },
  progressFill: {
    width: '25%',
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 10,
  },
  dailyText: {
    fontSize: 13,
    color: '#666',
  },
  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#6C63FF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEE',
  },
  expenseInfo: {
    flex: 1,
    marginLeft: 15,
  },
  expenseName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  expensePercent: {
    fontSize: 13,
    color: 'gray',
  },
  expenseAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
});
