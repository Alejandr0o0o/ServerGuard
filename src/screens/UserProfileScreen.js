import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../utils/supabase";

export default function UserProfileScreen() {
  const [perfil, setPerfil] = useState(null);
  const [email, setEmail] = useState("");

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
        .select("nombre, rol, creado_en")
        .eq("id", user.id)
        .single();
      if (data) setPerfil(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
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
          <MaterialIcons name="date-range" size={20} color="#94A3B8" />
          <Text style={styles.infoText}>
            Registrado:{" "}
            {perfil?.creado_en
              ? new Date(perfil.creado_en).toLocaleDateString()
              : ""}
          </Text>
        </View>
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
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
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
