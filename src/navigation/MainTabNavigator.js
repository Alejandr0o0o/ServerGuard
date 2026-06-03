import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { supabase } from "../utils/supabase";

import AdminUsersScreen from "../screens/AdminUsersScreen"; // <-- Importamos la pantalla de admin
import AlertsScreen from "../screens/AlertsScreen";
import DashboardScreen from "../screens/DashboardScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerRol();
  }, []);

  const obtenerRol = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", user.id)
        .single();
      if (data) setRol(data.rol);
    }
    setCargando(false);
  };

  if (cargando) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0F172A",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopColor: "#334155",
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#64748B",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Inicio") iconName = "dashboard";
          else if (route.name === "Alertas") iconName = "notifications";
          else if (route.name === "Usuarios")
            iconName = "people"; // <-- Ícono de la nueva pestaña
          else if (route.name === "Perfil") iconName = "person";

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Alertas" component={AlertsScreen} />

      {/* SEGURIDAD DINÁMICA: Esta pestaña SOLO se renderiza si el rol es Administrador */}
      {rol === "Administrador" && (
        <Tab.Screen name="Usuarios" component={AdminUsersScreen} />
      )}

      <Tab.Screen name="Perfil" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}
