import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserProfileScreen({ route, navigation }) {
  // Recibimos los parámetros enviados desde el Dashboard (o usamos valores por defecto)
  const { adminName = "Usuario", role = "Administrador" } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{adminName.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{adminName}</Text>
        <Text style={styles.role}>{role} del Sistema IoT</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Turno:</Text>
          <Text style={styles.infoValue}>Matutino</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Último acceso:</Text>
          <Text style={styles.infoValue}>Hoy, 08:30 AM</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Regresar al Monitoreo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
    justifyContent: "center",
  },
  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#001529",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, color: "#FFF", fontWeight: "bold" },
  name: { fontSize: 24, fontWeight: "bold", color: "#262626" },
  role: { fontSize: 16, color: "#1890FF", marginTop: 4, fontWeight: "600" },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    width: "100%",
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: { fontSize: 16, color: "#8C8C8C" },
  infoValue: { fontSize: 16, color: "#262626", fontWeight: "500" },
  backButton: {
    marginTop: 30,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#E6F7FF",
    borderWidth: 1,
    borderColor: "#1890FF",
  },
  backButtonText: { color: "#1890FF", fontSize: 16, fontWeight: "bold" },
});
