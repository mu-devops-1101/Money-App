import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GetStarted from "./screens/GetStarted";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Register from "./screens/Register";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="GetStarted" component={GetStarted} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Register" component={Register}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
