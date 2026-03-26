import {
    Feather,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CustomTabButton } from "../components/ReusableComponents";
import Colors from "../constants/Colors";

// Importamos las pantallas reales
import DashboardScreen from "../screens/DashboardScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Tab = createBottomTabNavigator();

// Función auxiliar para elegir el icono adecuado según la pestaña y estado
const getIcon = (routeName, focused) => {
  const color = focused ? Colors.primary : Colors.grayIcon;
  const size = 26;

  switch (routeName) {
    case "Dashboard":
      return (
        <MaterialCommunityIcons
          name="view-dashboard"
          size={size}
          color={color}
        />
      );
    case "Details":
      return (
        <MaterialCommunityIcons
          name="file-document-outline"
          size={size}
          color={color}
        />
      );
    case "User":
      return <MaterialIcons name="person-outline" size={size} color={color} />;
    case "Settings":
      return <Feather name="settings" size={size} color={color} />;
    default:
      return null;
  }
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false, // Ocultar el header predeterminado
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          height: 90,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 15,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grayIcon,
        tabBarLabelStyle: { fontSize: 13, fontWeight: "600", marginBottom: 5 },
        tabBarIcon: ({ focused }) => getIcon(route.name, focused),
        tabBarButton: (props) => <CustomTabButton {...props} />,
      })}
    >
      {/* ¡AQUÍ ESTÁ LA SOLUCIÓN! Faltaban las pantallas hijas */}
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      {/* Podemos poner pestañas de "relleno" para que se vea como en tu diseño, 
          apuntando al Dashboard temporalmente o creando componentes vacíos */}
      <Tab.Screen
        name="Details"
        component={DashboardScreen}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />

      <Tab.Screen name="User" component={UserProfileScreen} />

      <Tab.Screen
        name="Settings"
        component={DashboardScreen}
        listeners={{ tabPress: (e) => e.preventDefault() }}
      />
    </Tab.Navigator>
  );
}
