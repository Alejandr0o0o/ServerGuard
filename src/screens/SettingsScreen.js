// src/screens/SettingsScreen.js
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
import Colors from "../constants/Colors";
import { supabase } from "../utils/supabase";

export default function SettingsScreen() {
  const [devices, setDevices] = useState([]);

  // 1. READ (Leer): Carga los dispositivos al abrir la pantalla
  const fetchDevices = async () => {
    const { data, error } = await supabase
      .from("iot_devices")
      .select("*")
      .order("id", { ascending: true });
    if (error) Alert.alert("Error", error.message);
    else setDevices(data);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // 2. CREATE (Crear): Agrega un nuevo dispositivo falso
  const addDevice = async () => {
    const newDevice = {
      name: `Nuevo Sensor ${Math.floor(Math.random() * 100)}`,
      mac_address: `00:11:22:${Math.floor(Math.random() * 99)}:AA`,
      status: "active",
    };

    const { error } = await supabase.from("iot_devices").insert([newDevice]);
    if (error) Alert.alert("Error", error.message);
    else {
      Alert.alert("Éxito", "Dispositivo agregado (CREATE)");
      fetchDevices(); // Recargar la lista
    }
  };

  // 3. UPDATE (Actualizar): Cambia el estado de Activo a Inactivo
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("iot_devices")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) Alert.alert("Error", error.message);
    else {
      Alert.alert("Éxito", "Estado actualizado (UPDATE)");
      fetchDevices();
    }
  };

  // 4. DELETE (Eliminar): Borra el dispositivo
  const deleteDevice = async (id) => {
    const { error } = await supabase.from("iot_devices").delete().eq("id", id);

    if (error) Alert.alert("Error", error.message);
    else {
      Alert.alert("Éxito", "Dispositivo eliminado (DELETE)");
      fetchDevices();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin de Dispositivos (CRUD)</Text>

      {/* Botón CREATE */}
      <TouchableOpacity style={styles.addButton} onPress={addDevice}>
        <Text style={styles.addButtonText}>+ Añadir Dispositivo (CREATE)</Text>
      </TouchableOpacity>

      {/* Lista READ */}
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>MAC: {item.mac_address}</Text>
              <Text
                style={[
                  styles.cardStatus,
                  {
                    color:
                      item.status === "active"
                        ? Colors.statusOptimal
                        : Colors.danger,
                  },
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>

            <View style={styles.actions}>
              {/* Botón UPDATE */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => toggleStatus(item.id, item.status)}
              >
                <MaterialIcons
                  name="autorenew"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>

              {/* Botón DELETE */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => deleteDevice(item.id)}
              >
                <MaterialIcons name="delete" size={24} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: "bold" },
  cardSub: { color: Colors.textSecondary, fontSize: 14, marginTop: 4 },
  cardStatus: { fontSize: 12, fontWeight: "bold", marginTop: 4 },
  actions: { flexDirection: "row" },
  iconButton: {
    marginLeft: 15,
    padding: 5,
    backgroundColor: "#2A3441",
    borderRadius: 8,
  },
});
