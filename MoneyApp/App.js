import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Import หน้าจอ (Screen) ทั้งหมดที่คุณสร้างขึ้น
import GetStarted from './screens/GetStarted';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import AddTransaction from './screens/AddTransaction';

// 2. สร้างตัวนำทางแบบ Stack
const Stack = createNativeStackNavigator();

function App() {
    return (
        // 3. ห่อหุ้มทุกอย่างด้วย NavigationContainer
        <NavigationContainer>
            {/* 4. กำหนด "กอง" ของหน้าจอ (Stack Navigator) */}
            <Stack.Navigator
                initialRouteName="AddTransaction" // กำหนดหน้าแรกที่แอปจะเปิด
                screenOptions={{
                    headerShown: false // ซ่อน Header เริ่มต้นของทุกหน้า
                }}
            >
                {/* 5. กำหนดแต่ละ Route และ Component ของมัน */}
                <Stack.Screen name="GetStarted" component={GetStarted} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="AddTransaction" component={AddTransaction} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;