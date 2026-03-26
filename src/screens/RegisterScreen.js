import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput placeholder="Usuario" style={styles.input} />
      <TextInput placeholder="Correo" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />

      <Button 
        title="Registrarse" 
        onPress={() => navigation.replace('Main')} 
      />

      <Text 
        style={styles.link}
        onPress={() => navigation.navigate('Login')}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center'
  }
});