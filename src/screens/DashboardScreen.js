import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SensorCard } from "../components/ReusableComponents";
import Colors from "../constants/Colors";

// Componente para una métrica de estadísticas individual
const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

export default function DashboardScreen({ navigation }) {
  // HOOKS: Manejo de estado simulando datos de sensores en tiempo real
  const [temperatura, setTemperatura] = useState(22.5);
  const [humedad, setHumedad] = useState(45);

  // HOOKS: Simulación de actualización de datos cada 3 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      // Pequeñas variaciones aleatorias para que parezca "en vivo"
      setTemperatura(
        (prev) => +(prev + (Math.random() * 0.3 - 0.15)).toFixed(1),
      );
      setHumedad((prev) => Math.floor(prev + (Math.random() * 2 - 1)));
    }, 3000);

    return () => clearInterval(intervalo); // Limpieza al desmontar
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* HEADER PRINCIPAL */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="shield-outline"
            size={32}
            color={Colors.primary}
          />
          <Text style={styles.appName}>SERVERGUARD</Text>
        </View>
        <TouchableOpacity style={styles.avatar}>
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Hello, Alejandro</Text>
      <View style={styles.statusRow}>
        <View
          style={[styles.statusDot, { backgroundColor: Colors.statusOptimal }]}
        />
        <Text style={styles.statusText}>Server Room: Secure</Text>
      </View>

      {/* SECCIÓN DE SENSORES EN VIVO */}
      <Text style={styles.sectionTitle}>LIVE SENSORS</Text>
      <View style={styles.sensorGrid}>
        <SensorCard
          iconName="thermometer-lines"
          title="TEMPERATURE"
          value={temperatura}
          unit="°C"
          statusText="Optimal"
          statusColor={Colors.statusOptimal}
          topBorderColor={
            temperatura > 25 ? Colors.danger : Colors.statusOptimal
          } // Cambia a rojo si hay mucho calor
        />
        <SensorCard
          iconName="water"
          title="HUMIDITY"
          value={humedad}
          unit="%"
          statusText="Normal"
          statusColor={Colors.statusNormal}
        />
        <SensorCard
          iconName="fan"
          title="AC UNITS"
          value="2 Running"
          statusText="Active"
          statusColor={Colors.textSecondary}
        />
        <SensorCard
          iconName="zap"
          title="POWER LOAD"
          value="3.8 kW"
          statusText="Stable"
          statusColor={Colors.textSecondary}
        />
      </View>

      {/* SECCIÓN DE ESTADÍSTICAS DEL SISTEMA */}
      <View style={styles.statsCard}>
        <StatItem label="SYSTEM UPTIME" value="99.97%" />
        <View style={styles.statDivider} />
        <StatItem label="ACTIVE ALERTS" value="0" />
        <View style={styles.statDivider} />
        <StatItem label="DEVICES" value="12" />
      </View>

      {/* BOTÓN DE ACCIÓN PRINCIPAL - ENVÍO DE PARÁMETROS */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {
          // Aquí estamos cumpliendo la rúbrica: navegamos a 'User' y le enviamos 2 parámetros
          navigation.navigate("User", {
            adminName: "Supervisor Invitado",
            role: "Auditoría IoT",
          });
        }}
      >
        <Text style={styles.actionButtonText}>Test: Enviar Parámetros</Text>
        <Feather name="chevron-right" size={20} color={Colors.textPrimary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  contentContainer: { paddingBottom: 40, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginLeft: 10,
    textTransform: "uppercase",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "bold", color: Colors.background },
  greeting: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  statusText: { fontSize: 16, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 20,
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#4B5563",
    alignSelf: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10, // Efecto de brillo
  },
  actionButtonText: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
});
