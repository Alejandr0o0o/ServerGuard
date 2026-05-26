import { MaterialIcons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetailsScreen() {
  const [db, setDb] = useState(null);
  const [notes, setNotes] = useState([]);
  const [inputText, setInputText] = useState("");

  // 1. Inicializar la Base de Datos Local y crear la tabla
  useEffect(() => {
    const initDB = async () => {
      try {
        // Abre o crea el archivo .db físicamente en el celular
        const database = await SQLite.openDatabaseAsync("serverguard_local.db");
        setDb(database);

        // Crea la tabla si no existe
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS bitacora (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nota TEXT NOT NULL,
            fecha TEXT NOT NULL
          );
        `);

        // Carga las notas existentes
        await loadNotes(database);
      } catch (error) {
        console.error("Error iniciando SQLite:", error);
      }
    };
    initDB();
  }, []);

  // 2. Leer las notas (READ)
  const loadNotes = async (database) => {
    try {
      const allNotes = await database.getAllAsync(
        "SELECT * FROM bitacora ORDER BY id DESC;",
      );
      setNotes(allNotes);
    } catch (error) {
      console.error("Error cargando notas:", error);
    }
  };

  // 3. Agregar una nueva nota (CREATE)
  const addNote = async () => {
    if (inputText.trim() === "" || !db) return;

    const fechaActual = new Date().toLocaleString();
    try {
      await db.runAsync("INSERT INTO bitacora (nota, fecha) VALUES (?, ?)", [
        inputText,
        fechaActual,
      ]);
      setInputText(""); // Limpiar el input
      await loadNotes(db); // Recargar la lista
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  // 4. Eliminar una nota (DELETE)
  const deleteNote = async (id) => {
    if (!db) return;
    try {
      await db.runAsync("DELETE FROM bitacora WHERE id = ?", [id]);
      await loadNotes(db);
    } catch (error) {
      console.error("Error eliminando nota:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bitácora Local (SQLite)</Text>

      {/* Zona para escribir */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ej: Mantenimiento rack 2..."
          placeholderTextColor="#64748B"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNote}>
          <MaterialIcons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Lista de Notas Guardadas */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardText}>{item.nota}</Text>
              <Text style={styles.cardDate}>{item.fecha}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <MaterialIcons name="delete" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay registros locales.</Text>
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
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF", marginBottom: 20 },
  inputContainer: { flexDirection: "row", marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "#1E293B",
    color: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: { color: "#FFF", fontSize: 16 },
  cardDate: { color: "#94A3B8", fontSize: 12, marginTop: 5 },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
});
