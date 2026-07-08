import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import {
  User,
  Leaf,
  Moon,
  Bell,
  Fingerprint,
  Trash2,
  LogOut,
  Info,
  Heart,
  Pencil
} from 'lucide-react-native';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  tripCount: number;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  tripCount,
  onLogout
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
           <User size={40} color="#00b87c" />
        </View>
        <View style={styles.nameRow}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Pencil size={16} color="#00b87c" style={{ marginLeft: 8 }} />
        </View>
        <Text style={styles.profileBadge}>MEMBRO MOBILIZA PRO</Text>
      </View>

      <View style={styles.ecoCard}>
        <View style={styles.sectionHeader}>
           <Leaf size={16} color="#00b87c" />
           <Text style={styles.sectionTitleEco}>SEU ECO-IMPACTO</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{(tripCount * 0.4).toFixed(1)}kg</Text>
            <Text style={styles.statLabel}>CO2 Poupado</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{(tripCount * 0.02).toFixed(2)}</Text>
            <Text style={styles.statLabel}>Ar Limpo</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>PREFERÊNCIAS DO APP</Text>
      <View style={styles.card}>
        <View style={styles.prefItem}>
          <View style={styles.prefLeft}>
            <Moon size={18} color="#d4af37" />
            <Text style={styles.prefText}>Modo de Exibição</Text>
          </View>
          <View style={styles.modeBadge}>
             <Text style={styles.modeBadgeText}>ESCURO</Text>
          </View>
        </View>

        <View style={styles.prefItem}>
          <View style={styles.prefLeft}>
            <Bell size={18} color="#FFF" />
            <Text style={styles.prefText}>Notificações Push</Text>
          </View>
          <Switch
            value={profile.notificationOn}
            onValueChange={(val) => onUpdateProfile({ notificationOn: val })}
            trackColor={{ false: '#2D373D', true: '#00b87c' }}
          />
        </View>

        <View style={styles.prefItem}>
          <View style={styles.prefLeft}>
            <Fingerprint size={18} color="#FFF" />
            <Text style={styles.prefText}>Segurança Biométrica</Text>
          </View>
          <Switch
            value={profile.biometricOn}
            onValueChange={(val) => onUpdateProfile({ biometricOn: val })}
            trackColor={{ false: '#2D373D', true: '#00b87c' }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>DADOS E PRIVACIDADE</Text>
      <TouchableOpacity style={styles.cardAction}>
         <View style={styles.prefLeft}>
            <Trash2 size={18} color="#FF4B4B" />
            <Text style={styles.prefText}>Limpar Cache e Dados</Text>
         </View>
         <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>SOBRE O PROJETO</Text>
      <View style={styles.aboutCard}>
        <View style={styles.aboutHeader}>
          <Info size={18} color="#00b87c" />
          <Text style={styles.aboutTitle}>Projeto de TCC</Text>
        </View>

        <Text style={styles.aboutLabel}>👥 EQUIPE</Text>
        <View style={styles.teamGrid}>
          {['Jayme N. dos Santos', 'Sandra N. da Silva Santos', 'Silvana', 'Jordan', 'Mateus', 'Lucas'].map(name => (
            <View key={name} style={styles.teamChip}><Text style={styles.teamText}>{name}</Text></View>
          ))}
        </View>

        <View style={styles.techRow}>
          <View style={{flex: 1}}>
            <Text style={styles.techLabel}>{'<>'} BACK-END</Text>
            <Text style={styles.techText}>Java • JWT</Text>
            <Text style={styles.techText}>NFC (Simulação)</Text>
            <Text style={styles.techText}>PostgreSQL • Railway</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.techLabel}>📱 FRONT-END</Text>
            <Text style={styles.techText}>React Native</Text>
            <Text style={styles.techText}>Spring Boot</Text>
            <Text style={styles.techText}>Biometric Overlay</Text>
          </View>
        </View>

        <View style={styles.thanksRow}>
          <Heart size={16} color="#FF4B4B" fill="#FF4B4B" />
          <View>
            <Text style={styles.thanksLabel}>AGRADECIMENTO ESPECIAL</Text>
            <Text style={styles.thanksName}>Prof. Denilson Bernardo</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
         <LogOut size={18} color="#FF4B4B" style={{ opacity: 0.5 }} />
         <Text style={styles.logoutBtnText}>Encerrar Sessão</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
         <Text style={styles.versionText}>Mobiliza App - v3.0.0-PRO</Text>
         <Text style={styles.footerSub}>Tecnologia para Mobilidade Urbana</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  content: { padding: 24, paddingBottom: 120 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,184,124,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00b87c', marginBottom: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  profileName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileBadge: { color: '#7fa89e', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  ecoCard: { backgroundColor: '#14251F', borderRadius: 24, padding: 20, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(0,184,124,0.1)' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  ecoIcon: { fontSize: 16 },
  sectionTitleEco: { color: '#00b87c', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  statsRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#7fa89e', fontSize: 10, marginTop: 4 },

  sectionTitle: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: '#1A2227', borderRadius: 24, padding: 8, marginBottom: 24, borderWidth: 1, borderColor: '#2D373D' },
  cardAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1A2227', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#2D373D' },
  prefItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  prefLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prefText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  modeBadge: { backgroundColor: 'rgba(0,184,124,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  modeBadgeText: { color: '#00b87c', fontSize: 9, fontWeight: 'bold' },
  chevron: { color: '#7fa89e', fontSize: 20 },

  aboutCard: { backgroundColor: '#1A2227', borderRadius: 24, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: '#2D373D' },
  aboutHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  aboutTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  aboutLabel: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', marginBottom: 12 },
  teamGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  teamChip: { backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  teamText: { color: '#7fa89e', fontSize: 11 },
  techRow: { flexDirection: 'row', gap: 20, marginBottom: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 20 },
  techLabel: { color: '#00b87c', fontSize: 9, fontWeight: 'bold', marginBottom: 8 },
  techText: { color: '#7fa89e', fontSize: 10, marginBottom: 4 },
  thanksRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,184,124,0.03)', padding: 12, borderRadius: 16 },
  thanksLabel: { color: '#7fa89e', fontSize: 8, fontWeight: 'bold' },
  thanksName: { color: '#00b87c', fontSize: 12, fontWeight: 'bold' },

  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,75,75,0.05)', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,75,75,0.1)' },
  logoutBtnText: { color: '#FF4B4B', fontSize: 14, fontWeight: 'bold' },

  footer: { alignItems: 'center', marginTop: 10 },
  versionText: { color: '#5e8278', fontSize: 11, fontWeight: '500' },
  footerSub: { color: '#2D373D', fontSize: 9, marginTop: 4 },
});

export default ProfileView;
