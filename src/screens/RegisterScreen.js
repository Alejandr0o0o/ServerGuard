import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen({ navigation }) {

  //estados
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  //funcion registrar
  const registrarUsuario = () => {
    //validar campos vacios
    if(usuario.trim() === ''||correo.trim() === ''||password.trim() === ''){
       Alert.alert(
        'Error',
        'Complete todos los campos'
      );
      return;
    }
    //registro correcto
    Alert.alert(
      'Registro exitoso'
    );
    //navegar al main
    navigation.replace('Main');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
      />

       <TextInput
        placeholder="Correo"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={registrarUsuario}>
        <Text style={styles.registerButtonText}>
          Registrarse
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}>

        <Text style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
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

  registerButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold'
  },

  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#60A5FA',
    fontWeight: 'bold',
    fontSize: 16
  }

});