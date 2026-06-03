import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function DashboardScreen({ navigation }) {
  const [perfil, setPerfil] = useState(null);
  const [dispositivos, setDispositivos] = useState([]);
  const [totalAlertas, setTotalAlertas] = useState(0);
  const [totalSensores, setTotalSensores] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cada vez que la pantalla gana el foco (cuando regresas a ella), se actualizan los datos
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPerfil();
      fetchRacks();
      fetchEstadisticas();
    });

    // También ejecutamos la primera vez que carga
    fetchPerfil();
    fetchRacks();
    fetchEstadisticas();

    return unsubscribe;
  }, [navigation]);

  const fetchPerfil = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("perfiles")
        .select("nombre, rol")
        .eq("id", user.id)
        .single();
      if (data) setPerfil(data);
    }
  };

  const fetchRacks = async () => {
    const { data } = await supabase
      .from("racks")
      .select("*")
      .order("id", { ascending: true });
    if (data) setDispositivos(data);
    setLoading(false);
  };

  // NUEVA FUNCIÓN: Cuenta las alertas y sensores reales en la BD
  const fetchEstadisticas = async () => {
    try {
      const { count: countAlertas } = await supabase
        .from("incidencias")
        .select("*", { count: "exact", head: true });

      const { count: countSensores } = await supabase
        .from("iot_devices")
        .select("*", { count: "exact", head: true });

      setTotalAlertas(countAlertas || 0);
      setTotalSensores(countSensores || 0);
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado sin el botón de salir (lo moveremos al perfil) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola {perfil?.nombre} 👋</Text>
          <Text style={styles.subtitle}>Centro de Datos Principal</Text>
          <Text style={styles.roleBadge}>Rol: {perfil?.rol}</Text>
        </View>
      </View>

      {/* Tarjetas de Estadísticas DInámicas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dispositivos.length}</Text>
          <Text style={styles.statLabel}>Racks</Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              borderLeftColor: totalAlertas > 0 ? "#EAB308" : "#334155",
              borderLeftWidth: 4,
            },
          ]}
        >
          <Text style={styles.statValue}>{totalAlertas}</Text>
          <Text style={styles.statLabel}>Alertas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalSensores}</Text>
          <Text style={styles.statLabel}>Aparatos</Text>
        </View>
      </View>

      {perfil?.rol === "Administrador" && (
        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>Panel de Administración</Text>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("AdminUsers")}
          >
            <Text style={styles.adminButtonText}>
              Gestión de Usuarios y Permisos
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.racksSection}>
        <Text style={styles.sectionTitle}>Racks Monitoreados</Text>
        {dispositivos.map((rack) => (
          <TouchableOpacity
            key={rack.id}
            style={styles.rackCard}
            onPress={() =>
              navigation.navigate("Details", { rackSeleccionado: rack })
            }
          >
            <View style={styles.rackIconContainer}>
              <MaterialIcons name="dns" size={24} color="#94A3B8" />
            </View>
            <View style={styles.rackInfo}>
              <Text style={styles.rackName}>{rack.nombre}</Text>
              <View style={styles.rackStatusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        rack.estado === "Normal"
                          ? "#10B981"
                          : rack.estado === "Advertencia"
                            ? "#EAB308"
                            : "#EF4444",
                    },
                  ]}
                />
                <Text style={styles.rackStatusText}>{rack.estado}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#64748B" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  subtitle: { fontSize: 14, color: "#94A3B8", marginTop: 5 },
  roleBadge: {
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 5,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    width: "30%",
    alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
  statLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 5,
    textAlign: "center",
  },
  adminSection: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  adminButton: {
    backgroundColor: "#3B82F6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  adminButtonText: { color: "#FFF", fontWeight: "bold" },
  racksSection: { marginBottom: 40 },
  rackCard: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  rackIconContainer: {
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  rackInfo: { flex: 1 },
  rackName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  rackStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  rackStatusText: {
    color: "#94A3B8",
    fontSize: 12,
    textTransform: "capitalize",
  },
});
