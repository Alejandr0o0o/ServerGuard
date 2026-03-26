import {
    Feather,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

// 1. TARJETA DE SENSOR (Para el Dashboard)
export const SensorCard = ({
  iconName,
  iconFamily = "MaterialCommunityIcons",
  title,
  value,
  unit = "",
  statusText,
  statusColor,
  topBorderColor,
}) => {
  const IconComponent =
    iconFamily === "Feather" ? Feather : MaterialCommunityIcons;

  return (
    <View
      style={[
        styles.sensorCard,
        {
          borderTopColor: topBorderColor,
          borderTopWidth: topBorderColor ? 4 : 0,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <IconComponent name={iconName} size={28} color={Colors.textPrimary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>
        {value}
        <Text style={styles.cardUnit}>{unit}</Text>
      </Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </View>
    </View>
  );
};

// 2. FILA DE DETALLE (Para el Perfil)
export const ProfileDetailRow = ({
  iconName,
  iconFamily = "MaterialIcons",
  label,
  value,
}) => {
  const IconComponent = iconFamily === "Feather" ? Feather : MaterialIcons;
  return (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        <IconComponent name={iconName} size={26} color={Colors.textPrimary} />
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
};

// 3. TARJETA DE SEGURIDAD CON SWITCH (Para el Perfil)
export const SecurityToggleCard = ({
  title,
  subtitle,
  switchValue,
  onSwitchChange,
}) => (
  <View style={styles.securityCard}>
    <View style={styles.securityCardHeader}>
      <MaterialCommunityIcons
        name="bell-outline"
        size={30}
        color={Colors.textSecondary}
      />
      <View style={styles.securityTextContainer}>
        <Text style={styles.securityTitle}>{title}</Text>
        <Text style={styles.securitySubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Switch
      trackColor={{ false: "#4B5563", true: Colors.primary }}
      thumbColor={switchValue ? "#FFFFFF" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onSwitchChange}
      value={switchValue}
    />
  </View>
);

// 4. BOTÓN DE PESTAÑA PERSONALIZADO (Para la barra inferior)
// Esto logra el efecto visual exacto de la pestaña azul seleccionada.
// 4. BOTÓN DE PESTAÑA PERSONALIZADO (Para la barra inferior)
export const CustomTabButton = ({ children, onPress, accessibilityState }) => {
  // Le agregamos el signo de interrogación para evitar el error si viene undefined
  const selected = accessibilityState?.selected;

  return (
    <TouchableOpacity
      style={[styles.tabButton, selected ? styles.tabButtonSelected : null]}
      onPress={onPress}
      activeOpacity={1}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilos de SensorCard
  sensorCard: {
    backgroundColor: Colors.cardBackground,
    width: "47%",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cardTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginLeft: 8,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  cardUnit: { fontSize: 18, fontWeight: "400" },
  statusRow: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  statusText: { fontSize: 14, fontWeight: "600" },

  // Estilos de ProfileDetailRow
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground, // Fondo ligeramente más claro que el del contenedor
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  detailTextContainer: { flex: 1 },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 2,
  },
  detailValue: { fontSize: 18, fontWeight: "600", color: Colors.textPrimary },

  // Estilos de SecurityToggleCard
  securityCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  securityCardHeader: { flexDirection: "row", alignItems: "center" },
  securityTextContainer: { marginLeft: 16 },
  securityTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  securitySubtitle: { fontSize: 15, color: Colors.textSecondary },

  // Estilos de CustomTabButton
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabButtonSelected: {
    backgroundColor: "#1A2B50",
    borderRadius: 20,
    marginHorizontal: 12,
    marginVertical: 6,
  },
});
