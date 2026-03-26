import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ProfileDetailRow,
    SecurityToggleCard,
} from "../components/ReusableComponents";
import Colors from "../constants/Colors";

export default function UserProfileScreen({ route, navigation }) {
  // Capturar parámetros enviados (ej. si vinieras desde un login) o valores por defecto
  const {
    adminName = "Alejandro Aguirre",
    role = "Chief Systems Administrator",
  } = route.params || {};

  // HOOKS: Manejo de estado para el Switch
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* HEADER (Reutilizado del Dashboard para consistencia) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="shield-outline"
            size={32}
            color={Colors.primary}
          />
          <Text style={styles.appName}>SERVERGUARD</Text>
        </View>
      </View>

      {/* SECCIÓN DEL PERFIL PRINCIPAL */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>{adminName.charAt(0)}</Text>
          <View
            style={[
              styles.onlineDot,
              { backgroundColor: Colors.statusOptimal },
            ]}
          />
        </View>
        <Text style={styles.nameText}>{adminName}</Text>
        <Text style={styles.roleText}>{role}</Text>
      </View>

      {/* CONTENEDOR DE TARJETAS DE DETALLES */}
      <View style={styles.detailsCard}>
        {/* Usando los nombres correctos de MaterialIcons */}
        <ProfileDetailRow iconName="badge" label="EMPLOYEE ID" value="A-4567" />
        <View style={styles.divider} />
        <ProfileDetailRow
          iconName="business"
          label="DEPARTMENT"
          value="IT Infrastructure"
        />
        <View style={styles.divider} />
        <ProfileDetailRow
          iconName="wb-sunny"
          label="SHIFT"
          value="Morning (8 AM - 5 PM)"
        />
      </View>

      {/* SECCIÓN DE SEGURIDAD */}
      <Text style={styles.sectionTitle}>SECURITY</Text>
      <SecurityToggleCard
        title="Emergency Alarms"
        subtitle="Receive critical alerts"
        switchValue={alarmsEnabled}
        onSwitchChange={setAlarmsEnabled}
      />

      {/* ACCIÓN DE SALIR */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          /* Futura navegación a pantalla de Login */
        }}
      >
        <MaterialCommunityIcons name="export" size={24} color={Colors.danger} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  contentContainer: { paddingBottom: 40, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginLeft: 10,
    textTransform: "uppercase",
  },
  profileHeader: { alignItems: "center", marginBottom: 40 },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12, // Efecto de brillo
  },
  avatarLargeText: {
    fontSize: 60,
    fontWeight: "bold",
    color: Colors.background,
  },
  onlineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: Colors.background,
    position: "absolute",
    bottom: -5,
    right: -5,
  },
  nameText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  roleText: { fontSize: 16, color: Colors.primary, fontWeight: "600" },
  detailsCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 22,
    marginBottom: 30,
  },
  divider: {
    height: 1,
    backgroundColor: "#4B5563",
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    padding: 15,
  },
  logoutButtonText: {
    color: Colors.danger,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});
