import { MaterialIcons } from "@expo/vector-icons"; // Para los iconos de los servidores
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerfil();
    fetchRacks();
  }, []);

  const fetchPerfil = async () => {
    try {
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
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
    }
  };

  // Función para obtener los Racks de la tabla 'racks'
  const fetchRacks = async () => {
    try {
      const { data, error } = await supabase
        .from("racks")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      if (data) setDispositivos(data); // Reutilizamos el estado dispositivos para guardar los racks
    } catch (error) {
      console.error("Error obteniendo racks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
      {/* Encabezado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola {perfil?.nombre} 👋</Text>
          <Text style={styles.subtitle}>Centro de Datos Principal</Text>
          <Text style={styles.roleBadge}>Rol: {perfil?.rol}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjetas de Estadísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{dispositivos.length}</Text>
          <Text style={styles.statLabel}>Racks</Text>
        </View>
        <View
          style={[
            styles.statCard,
            { borderLeftColor: "#EAB308", borderLeftWidth: 4 },
          ]}
        >
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Alertas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>48</Text>
          <Text style={styles.statLabel}>Sensores</Text>
        </View>
      </View>

      {/* SEGURIDAD BASADA EN ROLES */}
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

      {/* Sección de Servidores/Racks conectada a la BD */}
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
                {/* Lógica de colores basada en el estado del Rack */}
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
  logoutButton: { backgroundColor: "#1E293B", padding: 10, borderRadius: 8 },
  logoutText: { color: "#EF4444", fontWeight: "bold" },

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
