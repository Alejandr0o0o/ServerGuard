import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MainTabNavigator from "./src/navigation/MainTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#101828" translucent={false} />

      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />

        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}