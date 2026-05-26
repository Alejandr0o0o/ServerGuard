import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen({ navigation }) {

//estados
const [usuario, setUsuario] = useState('');
const [password, setPassword] = useState('');

//función para iniciar sesión
const iniciarSesion = () =>{
  if (usuario.trim() === '' || password.trim() === ''){
    Alert.alert(
      'Error',
      'Datos vacíos. Ingrese los datos correctos por favor'
    );
    return;
  }
  //login correcto
  Alert.alert(
    'Bienvenido'
  );
  //navegar al main
  navigation.replace('Main');
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput placeholder="Usuario"
      placeholderTextColor= "#9CA3AF"
      style={styles.input}
      value={usuario}
      onChangeText={setUsuario} />

      <TextInput placeholder="Contraseña"
      secureTextEntry
      placeholderTextColor="#9CA3AF"
      style={styles.input}
      value={password}
      onChangeText={setPassword} />

      <TouchableOpacity
      style={styles.loginButton} 
      onPress={iniciarSesion}>
        <Text 
        style={styles.loginButtonTxt}>
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.registerButton}
      onPress={()=>navigation.navigate('Register')}>
        <Text
        style={styles.registerButtonText}>
          ¿No tienes cuenta? Registrate
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#0F172A'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    color: '#FFFFFF',
    fontSize: 16
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonTxt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },
  registerButton: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#60A5FA',
    alignItems: 'center'
  },
  registerButtonText: {
    color: '#60A5FA',
    fontSize: 16,
    fontWeight: 'bold'
  }
});