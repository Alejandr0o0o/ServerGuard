import { MaterialIcons } from "@expo/vector-icons";
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
  const [nivel, setNivel] = useState("Advertencia");

  // Estados de sesión y seguridad
  const [userId, setUserId] = useState(null);
  const [userRol, setUserRol] = useState(null);

  // Estado para saber si estamos editando
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    obtenerUsuarioActual();
    fetchIncidencias();
  }, []);

  const obtenerUsuarioActual = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      // Buscamos qué rol tiene para saber qué mostrarle
      const { data } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("id", user.id)
        .single();
      if (data) setUserRol(data.rol);
    }
  };

  const fetchIncidencias = async () => {
    // Al agregar 'perfiles(nombre)', Supabase hace un JOIN automático gracias a la llave foránea que configuramos
    const { data, error } = await supabase
      .from("incidencias")
      .select("*, perfiles(nombre)")
      .order("fecha_registro", { ascending: false });

    if (data) setIncidencias(data);
    if (error) console.error("Error cargando incidencias:", error);
  };

  const guardarOActualizarIncidencia = async () => {
    if (!titulo || !descripcion) {
      Alert.alert("Error", "Por favor llena el título y la descripción.");
      return;
    }

    if (idEdicion) {
      // Modo Edición (Solo para Admins)
      const { error } = await supabase
        .from("incidencias")
        .update({ titulo, descripcion, nivel_urgencia: nivel })
        .eq("id", idEdicion);

      if (error) Alert.alert("Error", error.message);
      else {
        Alert.alert("Éxito", "Incidencia actualizada correctamente.");
        cancelarEdicion();
      }
    } else {
      // Modo Creación
      const { error } = await supabase
        .from("incidencias")
        .insert([
          { titulo, descripcion, nivel_urgencia: nivel, creado_por: userId },
        ]);

      if (error) Alert.alert("Error", error.message);
      else {
        Alert.alert("Éxito", "Incidencia registrada correctamente.");
        cancelarEdicion();
      }
    }
    fetchIncidencias();
  };

  const confirmarEliminacion = (id) => {
    Alert.alert(
      "Eliminar Alerta",
      "¿Estás seguro de que deseas borrar este reporte de forma permanente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("incidencias")
              .delete()
              .eq("id", id);
            if (error) Alert.alert("Error", error.message);
            else fetchIncidencias();
          },
        },
      ],
    );
  };

  const cargarParaEditar = (item) => {
    setTitulo(item.titulo);
    setDescripcion(item.descripcion);
    setNivel(item.nivel_urgencia);
    setIdEdicion(item.id);
  };

  const cancelarEdicion = () => {
    setTitulo("");
    setDescripcion("");
    setNivel("Advertencia");
    setIdEdicion(null);
  };

  const getBorderColor = (nivelUrgencia) =>
    nivelUrgencia === "Critica" ? "#EF4444" : "#EAB308";

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Gestión de Incidencias</Text>

      {/* SEGURIDAD: El formulario NO se muestra si el rol es 'Usuario' */}
      {userRol !== "Usuario" && (
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {idEdicion
                ? "Editando alerta existente"
                : "Registrar nuevo fallo"}
            </Text>
            {idEdicion && (
              <TouchableOpacity onPress={cancelarEdicion}>
                <MaterialIcons name="close" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

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
            style={[
              styles.submitButton,
              idEdicion && { backgroundColor: "#10B981" },
            ]}
            onPress={guardarOActualizarIncidencia}
          >
            <Text style={styles.submitButtonText}>
              {idEdicion ? "Actualizar Reporte" : "Guardar / Enviar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de Incidencias (Visible para todos) */}
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

            <View style={styles.cardFooter}>
              <View style={styles.authorRow}>
                <MaterialIcons name="person" size={14} color="#64748B" />
                {/* Aquí mostramos el nombre del autor gracias a la modificación en BD */}
                <Text style={styles.cardDate}>
                  {" "}
                  Por: {item.perfiles?.nombre || "Sistema Automático"}
                </Text>
              </View>
              <Text style={styles.cardDate}>
                {new Date(item.fecha_registro).toLocaleDateString()}
              </Text>
            </View>

            {/* SEGURIDAD: Botones de control SOLO visibles para Administradores */}
            {userRol === "Administrador" && (
              <View style={styles.adminControls}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => cargarParaEditar(item)}
                >
                  <MaterialIcons name="edit" size={20} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => confirmarEliminacion(item.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
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
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  formTitle: { color: "#3B82F6", fontWeight: "bold", fontSize: 16 },
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
  cardDescription: { color: "#94A3B8", fontSize: 14, marginBottom: 10 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorRow: { flexDirection: "row", alignItems: "center" },
  cardDate: { color: "#64748B", fontSize: 12 },

  adminControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#334155",
    paddingTop: 10,
  },
  iconButton: { marginLeft: 15, padding: 5 },
});
