import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Import หน้าจอทั้งหมด
import GetStarted from './screens/GetStarted';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import AddTransaction from './screens/AddTransaction';
import Profile from './screens/Profile';
import Setting from './screens/Setting';
import Wallet from './screens/Wallet';
import WalletUp from './screens/WalletUp';
import ThisMonth from './screens/ThisMonth';

// 2. สร้าง Stack Navigator
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ThisMonth"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddTransaction" component={AddTransaction} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="ThisMonth" component={ThisMonth} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="WalletUp" component={WalletUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
