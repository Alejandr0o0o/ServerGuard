import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "./src/screens/DashboardScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: "ServerGuard - Inicio" }}
        />
        <Stack.Screen
          name="Perfil"
          component={UserProfileScreen}
          options={{ title: "Mi Cuenta" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
