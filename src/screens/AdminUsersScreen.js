import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function AdminUsersScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from("perfiles")
      .select("*")
      .order("creado_en", { ascending: false });

    if (data) setUsuarios(data);
    if (error) console.error(error);
  };

  const cambiarRol = async (id, nombre, nuevoRol) => {
    const { error } = await supabase
      .from("perfiles")
      .update({ rol: nuevoRol })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Éxito",
        `El rol de ${nombre} se ha actualizado a ${nuevoRol}`,
      );
      fetchUsuarios(); // Recargar la lista
    }
  };

  // Función para mostrar opciones de rol
  const mostrarOpciones = (id, nombre) => {
    Alert.alert(
      `Cambiar rol de ${nombre}`,
      "Selecciona el nuevo nivel de acceso:",
      [
        {
          text: "Administrador",
          onPress: () => cambiarRol(id, nombre, "Administrador"),
        },
        { text: "Tecnico", onPress: () => cambiarRol(id, nombre, "Tecnico") },
        { text: "Usuario", onPress: () => cambiarRol(id, nombre, "Usuario") },
        { text: "Cancelar", style: "cancel" },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Gestión de Usuarios</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.role}>
                Rol actual: <Text style={styles.roleHighlight}>{item.rol}</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => mostrarOpciones(item.id, item.nombre)}
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay usuarios registrados.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20 },
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
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  role: { color: "#94A3B8", fontSize: 14, marginTop: 4 },
  roleHighlight: { color: "#3B82F6", fontWeight: "bold" },
  editButton: { backgroundColor: "#3B82F6", padding: 10, borderRadius: 8 },
  emptyText: { color: "#64748B", textAlign: "center", marginTop: 20 },
});
