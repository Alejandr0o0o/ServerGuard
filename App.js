import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { supabase } from "./src/utils/supabase";

// Tus navegadores y pantallas
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Revisar si ya hay una sesión guardada al abrir la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuchar cambios (cuando el usuario inicia sesión o se sale)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Si hay sesión, entra directo al sistema principal */}
        {session && session.user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            {/* Si NO hay sesión, se queda atrapado en el Login */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
