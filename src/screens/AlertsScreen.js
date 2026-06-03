import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function AlertsScreen() {
  const [incidencias, setIncidencias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("Advertencia"); // Advertencia o Critica
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    obtenerUsuarioActual();
    fetchIncidencias();
  }, []);

  const obtenerUsuarioActual = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const fetchIncidencias = async () => {
    const { data, error } = await supabase
      .from("incidencias")
      .select("*")
      .order("fecha_registro", { ascending: false });

    if (data) setIncidencias(data);
    if (error) console.error("Error cargando incidencias:", error);
  };

  const guardarIncidencia = async () => {
    if (!titulo || !descripcion) {
      Alert.alert("Error", "Por favor llena el título y la descripción.");
      return;
    }

    const { error } = await supabase
      .from("incidencias")
      .insert([
        { titulo, descripcion, nivel_urgencia: nivel, creado_por: userId },
      ]);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Incidencia registrada correctamente.");
      setTitulo("");
      setDescripcion("");
      fetchIncidencias(); // Recargar la lista
    }
  };

  const getBorderColor = (nivelUrgencia) => {
    return nivelUrgencia === "Critica" ? "#EF4444" : "#EAB308";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gestión de Incidencias</Text>

      {/* Formulario de Nueva Incidencia (Caso de Prueba CP-F05) */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Registrar nuevo fallo</Text>
        <TextInput
          style={styles.input}
          placeholder="Título del problema (Ej. Caída de red)"
          placeholderTextColor="#64748B"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Descripción detallada..."
          placeholderTextColor="#64748B"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.levelButton,
              nivel === "Advertencia" && styles.levelButtonActiveAdv,
            ]}
            onPress={() => setNivel("Advertencia")}
          >
            <Text style={styles.levelText}>Advertencia</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.levelButton,
              nivel === "Critica" && styles.levelButtonActiveCrit,
            ]}
            onPress={() => setNivel("Critica")}
          >
            <Text style={styles.levelText}>Crítica</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={guardarIncidencia}
        >
          <Text style={styles.submitButtonText}>Guardar / Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Incidencias */}
      <Text style={styles.listTitle}>Historial de Alertas</Text>
      <FlatList
        data={incidencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                borderLeftColor: getBorderColor(item.nivel_urgencia),
                borderLeftWidth: 4,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: getBorderColor(item.nivel_urgencia) },
                ]}
              >
                <Text style={styles.badgeText}>{item.nivel_urgencia}</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{item.descripcion}</Text>
            <Text style={styles.cardDate}>
              {new Date(item.fecha_registro).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay incidencias registradas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },

  formContainer: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
  },
  formTitle: {
    color: "#3B82F6",
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  levelButton: {
    flex: 0.48,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  levelButtonActiveAdv: { backgroundColor: "#EAB308", borderColor: "#EAB308" },
  levelButtonActiveCrit: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  levelText: { color: "#FFF", fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold", flex: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  cardDescription: { color: "#94A3B8", fontSize: 14, marginBottom: 8 },
  cardDate: { color: "#64748B", fontSize: 11 },
});
