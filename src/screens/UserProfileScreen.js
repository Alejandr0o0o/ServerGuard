import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function UserProfileScreen() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cargandoClave, setCargandoClave] = useState(false);

  useEffect(() => {
    fetchUsuario();
  }, []);

  const fetchUsuario = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email);
      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) setPerfil(data);
    }
  };

  // Función exclusiva del usuario logueado para cambiar su propia contraseña
  const cambiarMiPassword = async () => {
    if (nuevaPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargandoClave(true);
    const { error } = await supabase.auth.updateUser({
      password: nuevaPassword,
    });

    setCargandoClave(false);

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Tu contraseña ha sido actualizada correctamente.");
      setNuevaPassword(""); // Limpiamos la cajita
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Mi Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={60} color="#3B82F6" />
        </View>
        <Text style={styles.name}>{perfil?.nombre || "Cargando..."}</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="admin-panel-settings"
            size={20}
            color="#94A3B8"
          />
          <Text style={styles.infoText}>
            Nivel de acceso:{" "}
            <Text style={{ color: "#3B82F6", fontWeight: "bold" }}>
              {perfil?.rol}
            </Text>
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="security" size={20} color="#94A3B8" />
          <Text style={styles.infoText}>
            Estado de cuenta:{" "}
            <Text
              style={{
                color: perfil?.estado === "Activo" ? "#10B981" : "#EF4444",
                fontWeight: "bold",
              }}
            >
              {perfil?.estado}
            </Text>
          </Text>
        </View>
      </View>

      {/* SECCIÓN NUEVA: Cambio de Contraseña */}
      <View style={styles.passwordSection}>
        <Text style={styles.sectionTitle}>Actualizar Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nueva contraseña..."
          placeholderTextColor="#64748B"
          secureTextEntry
          value={nuevaPassword}
          onChangeText={setNuevaPassword}
        />
        <TouchableOpacity
          style={styles.updateButton}
          onPress={cambiarMiPassword}
          disabled={cargandoClave}
        >
          <Text style={styles.updateButtonText}>
            {cargandoClave ? "Actualizando..." : "Guardar nueva contraseña"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons
          name="logout"
          size={24}
          color="#FFF"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.logoutText}>Cerrar Sesión Segura</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
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
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 25,
  },
  avatar: {
    backgroundColor: "#334155",
    padding: 20,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#FFF", marginBottom: 5 },
  email: { fontSize: 14, color: "#94A3B8", marginBottom: 20 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoText: { color: "#FFF", marginLeft: 10, fontSize: 14 },

  passwordSection: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sectionTitle: {
    color: "#3B82F6",
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#0F172A",
    color: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },
  updateButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: { color: "#FFF", fontWeight: "bold" },

  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
