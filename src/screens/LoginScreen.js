import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../utils/supabase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingresa correo y contraseña");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setLoading(false);

    if (error) {
      // Bloqueo por credenciales incorrectas (Requisito de QA)
      Alert.alert(
        "Acceso Denegado",
        "Credenciales incorrectas o usuario no encontrado.",
      );
    }
    // Si es exitoso, App.js detectará el cambio y lo mandará al Dashboard automáticamente
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>ServerGuard</Text>
        <Text style={styles.subtitle}>Monitoreo inteligente</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="usuario@ejemplo.com"
        placeholderTextColor="#64748B"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#64748B"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logoText: { fontSize: 32, fontWeight: "bold", color: "#3B82F6" },
  subtitle: { fontSize: 16, color: "#94A3B8" },
  input: {
    backgroundColor: "#1E293B",
    color: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#3B82F6", textAlign: "center", marginTop: 20 },
});
