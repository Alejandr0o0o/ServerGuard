import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import MainTabNavigator from "./src/navigation/MainTabNavigator";

export default function App() {
  return (
    <NavigationContainer>
      {/* Forzar una barra de estado clara para que contraste con el fondo oscuro */}
      <StatusBar style="light" backgroundColor="#101828" translucent={false} />
      {/* Punto de entrada: El Navegador por Pestañas */}
      <MainTabNavigator />
    </NavigationContainer>
  );
}
