import { MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { supabase } from "../utils/supabase";

export default function DetailsScreen({ route, navigation }) {
  // Recibimos el rack que el usuario tocó en el Dashboard
  const rack = route.params?.rackSeleccionado;

  const [dispositivos, setDispositivos] = useState([]);
  const [db, setDb] = useState(null);
  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");

  useEffect(() => {
    if (rack) {
      fetchDispositivos();
      initSQLite();
    }
  }, [rack]);

  // ==========================================
  // 1. LÓGICA DE SUPABASE (Aparatos IoT)
  // ==========================================
  const fetchDispositivos = async () => {
    const { data, error } = await supabase
      .from("iot_devices")
      .select("*")
      .eq("rack_id", rack.id); // Solo traemos los aparatos de ESTE rack

    if (data) setDispositivos(data);
    if (error) console.error("Error obteniendo aparatos:", error);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    // Actualizamos la UI inmediatamente para que se sienta rápido
    setDispositivos(
      dispositivos.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
    );

    // Mandamos la orden a Supabase
    const { error } = await supabase
      .from("iot_devices")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) console.error("Error actualizando estado:", error);
  };

  // ==========================================
  // 2. LÓGICA DE SQLITE (Bitácora Local)
  // ==========================================
  const initSQLite = async () => {
    try {
      const database = await SQLite.openDatabaseAsync("serverguard_local.db");
      setDb(database);
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS bitacora_racks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rack_id INTEGER,
          nota TEXT NOT NULL,
          fecha TEXT NOT NULL
        );
      `);
      cargarNotas(database);
    } catch (error) {
      console.error("Error iniciando SQLite:", error);
    }
  };

  const cargarNotas = async (database) => {
    try {
      // Solo cargamos las notas de este Rack en específico
      const result = await database.getAllAsync(
        "SELECT * FROM bitacora_racks WHERE rack_id = ? ORDER BY id DESC;",
        [rack.id],
      );
      setNotas(result);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  const agregarNota = async () => {
    if (nuevaNota.trim() === "" || !db) return;
    const fechaActual = new Date().toLocaleString();
    try {
      await db.runAsync(
        "INSERT INTO bitacora_racks (rack_id, nota, fecha) VALUES (?, ?, ?)",
        [rack.id, nuevaNota, fechaActual],
      );
      setNuevaNota("");
      cargarNotas(db);
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  // Si no se seleccionó ningún rack (por ejemplo, si entraron tocando la pestaña directamente)
  if (!rack) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Por favor, selecciona un Rack desde el Dashboard.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Botón de regresar y Título */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{rack.nombre}</Text>
          <Text style={styles.subtitle}>
            Estado general:{" "}
            <Text
              style={{
                color: rack.estado === "Normal" ? "#10B981" : "#EF4444",
              }}
            >
              {rack.estado}
            </Text>
          </Text>
        </View>
      </View>

      {/* SECCIÓN 1: Control de Aparatos IoT (Supabase) */}
      <Text style={styles.sectionTitle}>Aparatos Instalados (Nube)</Text>
      {dispositivos.length === 0 ? (
        <Text style={styles.emptyText}>
          No hay aparatos vinculados a este rack.
        </Text>
      ) : (
        dispositivos.map((device) => (
          <View key={device.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceMac}>MAC: {device.mac_address}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Switch
                value={device.status === "active"}
                onValueChange={() => toggleStatus(device.id, device.status)}
                trackColor={{ false: "#334155", true: "#10B981" }}
                thumbColor={"#FFF"}
              />
              <Text style={styles.statusText}>
                {device.status === "active" ? "ACTIVO" : "INACTIVO"}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* SECCIÓN 2: Bitácora de Mantenimiento (SQLite Local) */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>Bitácora Local de Mantenimiento</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Se ajustó el cableado..."
          placeholderTextColor="#64748B"
          value={nuevaNota}
          onChangeText={setNuevaNota}
        />
        <TouchableOpacity style={styles.addButton} onPress={agregarNota}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {notas.map((item) => (
        <View key={item.id.toString()} style={styles.noteCard}>
          <Text style={styles.noteText}>{item.nota}</Text>
          <Text style={styles.noteDate}>{item.fecha}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
  centered: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: "#94A3B8", fontSize: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    backgroundColor: "#1E293B",
    borderRadius: 8,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#FFF" },
  subtitle: { fontSize: 14, color: "#94A3B8" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  deviceName: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  deviceMac: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  statusText: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "bold",
  },

  divider: { height: 1, backgroundColor: "#334155", marginVertical: 25 },

  inputContainer: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    color: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noteCard: {
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  noteText: { color: "#FFF", fontSize: 14 },
  noteDate: { color: "#64748B", fontSize: 11, marginTop: 5 },
});
