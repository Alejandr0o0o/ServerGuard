import { AlertTriangle, ChevronRight } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ServerItem = ({ name, ip, status, load }) => (
  <TouchableOpacity style={styles.serverCard}>
    <View style={[styles.statusDot, { backgroundColor: status === 'Online' ? '#10b981' : '#ef4444' }]} />
    <View style={styles.serverInfo}>
      <Text style={styles.serverName}>{name}</Text>
      <Text style={styles.serverIp}>{ip}</Text>
    </View>
    <View style={styles.serverStats}>
      <Text style={styles.loadText}>{load}% CPU</Text>
      <ChevronRight size={18} color="#475569" />
    </View>
  </TouchableOpacity>
);

export default function DetailsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Infraestructura</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Servidores Activos</Text>
        <ServerItem name="Main Database" ip="192.168.1.10" status="Online" load="24" />
        <ServerItem name="Web Cluster A" ip="192.168.1.12" status="Online" load="45" />
        <ServerItem name="Backup Server" ip="192.168.1.15" status="Offline" load="0" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas de Seguridad</Text>
        <View style={styles.alertCard}>
          <AlertTriangle color="#f59e0b" size={20} />
          <Text style={styles.alertText}>Intento de acceso no autorizado en Nodo 4</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617', padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginTop: 40, marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { color: '#64748b', fontSize: 14, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase' },
  serverCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  serverInfo: { flex: 1 },
  serverName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  serverIp: { color: '#64748b', fontSize: 13 },
  serverStats: { flexDirection: 'row', alignItems: 'center' },
  loadText: { color: '#10b981', fontSize: 13, marginRight: 8 },
  alertCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)'
  },
  alertText: { color: '#f59e0b', fontSize: 14, marginLeft: 10, flex: 1 }
});