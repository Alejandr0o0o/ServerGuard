import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function AdminUsersScreen() {
  const [usuarios, setUsuarios] = useState([]);

  // Estados para controlar nuestra nueva ventana emergente
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

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

  const actualizarUsuario = async (campo, valor, mensajeExito) => {
    if (!usuarioSeleccionado) return;

    const { error } = await supabase
      .from("perfiles")
      .update({ [campo]: valor })
      .eq("id", usuarioSeleccionado.id);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", mensajeExito);
      setModalVisible(false); // Cerramos el menú
      fetchUsuarios(); // Recargamos la lista
    }
  };

  const abrirMenu = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.role}>
                Rol: <Text style={styles.roleHighlight}>{item.rol}</Text>
              </Text>

              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        item.estado === "Activo" ? "#10B981" : "#EF4444",
                    },
                  ]}
                />
                <Text style={styles.statusText}>{item.estado || "Activo"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => abrirMenu(item)}
            >
              <MaterialIcons name="settings" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay usuarios registrados.</Text>
        }
      />

      {/* NUEVO MODAL PERSONALIZADO (Ventana Emergente Premium) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gestionar Usuario</Text>
              <Text style={styles.modalSubtitle}>
                {usuarioSeleccionado?.nombre}
              </Text>
            </View>

            {/* Opciones de Roles */}
            <Text style={styles.modalSectionTitle}>
              Cambiar Nivel de Acceso
            </Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() =>
                actualizarUsuario(
                  "rol",
                  "Administrador",
                  "Rol actualizado a Administrador",
                )
              }
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={20}
                color="#3B82F6"
              />
              <Text style={styles.modalOptionText}>Hacer Administrador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() =>
                actualizarUsuario("rol", "Tecnico", "Rol actualizado a Técnico")
              }
            >
              <MaterialIcons name="build" size={20} color="#3B82F6" />
              <Text style={styles.modalOptionText}>Hacer Técnico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() =>
                actualizarUsuario("rol", "Usuario", "Rol actualizado a Usuario")
              }
            >
              <MaterialIcons name="person" size={20} color="#3B82F6" />
              <Text style={styles.modalOptionText}>Hacer Usuario Base</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Opción de Estado (Suspender/Activar) */}
            <Text style={styles.modalSectionTitle}>Estado de la Cuenta</Text>
            {usuarioSeleccionado?.estado === "Activo" ? (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                ]}
                onPress={() =>
                  actualizarUsuario(
                    "estado",
                    "Inactivo",
                    "Usuario suspendido temporalmente",
                  )
                }
              >
                <MaterialIcons name="block" size={20} color="#EF4444" />
                <Text style={[styles.modalOptionText, { color: "#EF4444" }]}>
                  Suspender Acceso (Inactivar)
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
                onPress={() =>
                  actualizarUsuario("estado", "Activo", "Usuario reactivado")
                }
              >
                <MaterialIcons name="check-circle" size={20} color="#10B981" />
                <Text style={[styles.modalOptionText, { color: "#10B981" }]}>
                  Reactivar Cuenta
                </Text>
              </TouchableOpacity>
            )}

            {/* Botón de Cancelar */}
            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar y Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 20 },
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
  statusContainer: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: "#94A3B8", fontSize: 12 },
  editButton: { backgroundColor: "#334155", padding: 10, borderRadius: 8 },
  emptyText: { color: "#64748B", textAlign: "center", marginTop: 20 },

  // Estilos del nuevo Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1E293B",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalHeader: { marginBottom: 20, alignItems: "center" },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalSubtitle: { color: "#94A3B8", fontSize: 14, marginTop: 4 },
  modalSectionTitle: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 5,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOptionText: {
    color: "#FFF",
    fontSize: 15,
    marginLeft: 15,
    fontWeight: "500",
  },
  divider: { height: 1, backgroundColor: "#334155", marginVertical: 15 },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#334155",
  },
  cancelButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
