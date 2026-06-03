import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function DetailsScreen({ route, navigation }) {
  const rack = route.params?.rackSeleccionado;

  // Estados existentes
  const [dispositivos, setDispositivos] = useState([]);
  const [db, setDb] = useState(null);
  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");

  // NUEVO: Estado para la telemetría del ESP32
  const [lectura, setLectura] = useState(null);

  useEffect(() => {
    if (rack) {
      fetchDispositivos();
      initSQLite();
      fetchUltimaLectura();

      // NUEVO: Suscripción en tiempo real a los sensores
      const canalSensores = supabase
        .channel("cambios-sensores")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "lecturas_sensores" },
          (payload) => {
            setLectura(payload.new); // Actualiza la pantalla sola cuando entra un dato
          },
        )
        .subscribe();

      // Limpiar conexión al salir de la pantalla
      return () => {
        supabase.removeChannel(canalSensores);
      };
    }
  }, [rack]);

  // ==========================================
  // 0. LÓGICA DE SENSORES EN VIVO (ESP32)
  // ==========================================
  const fetchUltimaLectura = async () => {
    const { data, error } = await supabase
      .from("lecturas_sensores")
      .select("*")
      .order("fecha_registro", { ascending: false })
      .limit(1)
      .single();
    if (data) setLectura(data);
  };

  // ==========================================
  // 1. LÓGICA DE SUPABASE (Aparatos IoT)
  // ==========================================
  const fetchDispositivos = async () => {
    const { data, error } = await supabase
      .from("iot_devices")
      .select("*")
      .eq("rack_id", rack?.id);
    if (data) setDispositivos(data);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setDispositivos(
      dispositivos.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
    );
    await supabase
      .from("iot_devices")
      .update({ status: newStatus })
      .eq("id", id);
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
            Estado:{" "}
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

      {/* NUEVA SECCIÓN: Telemetría en Tiempo Real */}
      <Text style={styles.sectionTitle}>Condiciones Físicas</Text>
      <View style={styles.grid}>
        <View style={styles.telemetryCard}>
          <MaterialCommunityIcons
            name="thermometer"
            size={32}
            color={lectura?.temperatura > 29 ? "#EF4444" : "#3B82F6"}
          />
          <Text style={styles.valueText}>
            {lectura?.temperatura ? `${lectura.temperatura}°C` : "--"}
          </Text>
          <Text style={styles.label}>Temperatura</Text>
        </View>

        <View style={styles.telemetryCard}>
          <MaterialCommunityIcons
            name="water-percent"
            size={32}
            color="#0EA5E9"
          />
          <Text style={styles.valueText}>
            {lectura?.humedad ? `${lectura.humedad}%` : "--"}
          </Text>
          <Text style={styles.label}>Humedad</Text>
        </View>
      </View>

      <View
        style={[
          styles.telemetryCard,
          {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 25,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={
              lectura?.gas_detectado ? "fire-alert" : "smoke-detector-outline"
            }
            size={28}
            color={lectura?.gas_detectado ? "#EF4444" : "#10B981"}
          />
          <Text style={[styles.label, { marginLeft: 15, fontSize: 14 }]}>
            Sensor de Gas / Humo
          </Text>
        </View>
        <Text
          style={[
            styles.valueText,
            {
              color: lectura?.gas_detectado ? "#EF4444" : "#10B981",
              fontSize: 16,
              marginTop: 0,
            },
          ]}
        >
          {lectura?.gas_detectado ? "PELIGRO" : "Limpio"}
        </Text>
      </View>

      {/* SECCIÓN 1: Control de Aparatos IoT (Supabase) */}
      <View style={styles.divider} />
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#3B82F6",
    marginBottom: 15,
    textTransform: "uppercase",
  },

  // Estilos Nuevos para Telemetría
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  telemetryCard: {
    backgroundColor: "#1E293B",
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  valueText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  label: { color: "#94A3B8", fontSize: 12, textAlign: "center" },
  emptyText: { color: "#64748B", marginBottom: 10 },

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

  divider: { height: 1, backgroundColor: "#334155", marginVertical: 20 },

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
