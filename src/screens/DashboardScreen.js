import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// COMPONENTE REUTILIZABLE
const SensorCard = ({ title, value, unit, statusColor }) => (
  <View style={[styles.card, { borderLeftColor: statusColor }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>
      {value}
      <Text style={styles.cardUnit}>{unit}</Text>
    </Text>
  </View>
);

export default function DashboardScreen({ navigation }) {
  // HOOKS: Manejo de estado simulando los sensores
  const [temperatura, setTemperatura] = useState(22.5);
  const [humedad, setHumedad] = useState(45);

  // HOOKS: Simulamos la actualización de datos cada 3 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      // Variamos un poco los valores para que parezca "en vivo"
      setTemperatura(
        (prev) => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1),
      );
      setHumedad((prev) => Math.floor(prev + (Math.random() * 2 - 1)));
    }, 3000);

    return () => clearInterval(intervalo); // Limpiamos el intervalo al salir
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Estado del Site</Text>
        <Text style={styles.subtitle}>Monitoreo en tiempo real</Text>
      </View>

      <View style={styles.grid}>
        <SensorCard
          title="Temperatura"
          value={temperatura}
          unit=" °C"
          statusColor={temperatura > 25 ? "#FF4D4F" : "#52C41A"} // Cambia a rojo si se calienta
        />
        <SensorCard
          title="Humedad Relativa"
          value={humedad}
          unit=" %"
          statusColor="#1890FF"
        />
        <SensorCard
          title="Estado Puerta"
          value="Cerrada"
          unit=""
          statusColor="#52C41A"
        />
        <SensorCard
          title="Humo / Fuego"
          value="Seguro"
          unit=""
          statusColor="#52C41A"
        />
      </View>

      {/* MANEJO DE EVENTOS Y NAVEGACIÓN */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Perfil", {
            adminName: "Alejandro",
            role: "SysAdmin",
          })
        }
      >
        <Text style={styles.buttonText}>Ver Perfil de Administrador</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  header: {
    padding: 24,
    backgroundColor: "#001529",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF" },
  subtitle: { fontSize: 16, color: "#A6ADB4", marginTop: 5 },
  grid: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFF",
    width: "48%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#8C8C8C",
    marginBottom: 8,
    fontWeight: "600",
  },
  cardValue: { fontSize: 24, fontWeight: "bold", color: "#262626" },
  cardUnit: { fontSize: 14, fontWeight: "normal" },
  button: {
    backgroundColor: "#1890FF",
    margin: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
