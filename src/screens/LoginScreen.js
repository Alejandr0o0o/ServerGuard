import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput placeholder="Usuario" style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry style={styles.input} />

      <Button 
        title="Entrar" 
        onPress={() => navigation.replace('Main')} 
      />

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Registrate
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