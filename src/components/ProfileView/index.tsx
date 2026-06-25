import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
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
  const [name, setName] = useState(profile.name);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const handleSave = () => {
    onUpdateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Cálculo de impacto ecológico (igual ao seu design original)
  const co2Saved = (tripCount * 0.85).toFixed(1);
  const treesEquivalent = (tripCount * 0.04).toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Gerencie suas configurações e preferências.</Text>
      </View>

      {/* Profile Form */}
      <View style={styles.card}>
        <Text style={styles.label}>Nome do Usuário</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#5e8278"
          />
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>{saved ? '✅' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Eco Impact Dashboard */}
      <View style={styles.ecoCard}>
        <View style={styles.ecoHeader}>
          <View style={styles.ecoIconBg}><Text style={{fontSize: 20}}>🍃</Text></View>
          <View>
            <Text style={styles.ecoTitle}>Seu Impacto Ecológico</Text>
            <Text style={styles.ecoSubtitle}>Pegada de Carbono Poupada</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>CO₂ ECONOMIZADO</Text>
            <Text style={styles.statValue}>{co2Saved} <Text style={{fontSize: 10}}>kg</Text></Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>AR LIMPO SALVO</Text>
            <Text style={styles.statValue}>{treesEquivalent} <Text style={{fontSize: 10}}>árvores</Text></Text>
          </View>
        </View>
        <Text style={styles.ecoQuote}>"Ao utilizar transporte público, você ajuda a reduzir emissões na sua cidade." 🌳</Text>
      </View>

      {/* Appearance */}
      <View style={styles.card}>
        <Text style={styles.label}>Aparência</Text>
        <View style={styles.rowBetween}>
          <View style={styles.infoRow}>
            <Text style={styles.iconBox}>🌙</Text>
            <View>
              <Text style={styles.itemTitle}>Modo de Exibição</Text>
              <Text style={styles.itemSub}>Tema escuro ou claro</Text>
            </View>
          </View>
          <View style={styles.themeSelector}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
              onPress={() => setTheme('dark')}
            >
              <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>Escuro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
              onPress={() => setTheme('light')}
            >
              <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>Claro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.card}>
        <Text style={styles.label}>Preferências</Text>

        <View style={styles.prefItem}>
          <View style={styles.infoRow}>
            <Text style={styles.iconBox}>🔔</Text>
            <View>
              <Text style={styles.itemTitle}>Notificações Push</Text>
              <Text style={styles.itemSub}>Alertas de recargas</Text>
            </View>
          </View>
          <Switch
            value={profile.notificationOn}
            onValueChange={(val) => onUpdateProfile({ notificationOn: val })}
            trackColor={{ false: '#2D373D', true: '#00b87c' }}
          />
        </View>

        <View style={styles.prefItem}>
          <View style={styles.infoRow}>
            <Text style={styles.iconBox}>☝️</Text>
            <View>
              <Text style={styles.itemTitle}>Biometria</Text>
              <Text style={styles.itemSub}>Digital para transações</Text>
            </View>
          </View>
          <Switch
            value={profile.biometricOn}
            onValueChange={(val) => onUpdateProfile({ biometricOn: val })}
            trackColor={{ false: '#2D373D', true: '#00b87c' }}
          />
        </View>
      </View>

      {/* Security Zone */}
      <View style={[styles.card, { borderColor: 'rgba(255, 75, 75, 0.1)' }]}>
        <Text style={[styles.label, { color: '#FF4B4B' }]}>Zona de Segurança</Text>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.itemTitle}>Limpar Dados Locais</Text>
            <Text style={styles.itemSub}>Apaga saldos e histórico</Text>
          </View>
          <TouchableOpacity style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Resetar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutBtnText}>SAIR DA CONTA</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versão 1.2.0-PRO</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  content: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F2F4F7' },
  subtitle: { fontSize: 13, color: '#5e8278', marginTop: 4 },
  card: { backgroundColor: '#1A2227', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#2D373D' },
  label: { fontSize: 10, color: '#5e8278', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#0D1317', borderRadius: 12, padding: 12, color: '#F2F4F7', borderWidth: 1, borderColor: '#2D373D' },
  saveBtn: { backgroundColor: 'rgba(0, 184, 124, 0.1)', paddingHorizontal: 16, borderRadius: 12, justifyContent: 'center', borderWidth: 1, borderColor: '#00b87c' },
  saveBtnText: { color: '#00b87c', fontWeight: 'bold', fontSize: 12 },
  ecoCard: { backgroundColor: 'rgba(0, 184, 124, 0.05)', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(0, 184, 124, 0.1)' },
  ecoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  ecoIconBg: { padding: 10, backgroundColor: 'rgba(0, 184, 124, 0.1)', borderRadius: 12 },
  ecoTitle: { color: '#00b87c', fontSize: 14, fontWeight: 'bold' },
  ecoSubtitle: { color: 'rgba(0, 184, 124, 0.7)', fontSize: 10 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#1A2227', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0, 184, 124, 0.1)' },
  statLabel: { color: '#5e8278', fontSize: 9, fontWeight: 'bold' },
  statValue: { color: '#00b87c', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  ecoQuote: { color: '#5e8278', fontSize: 10, fontStyle: 'italic', textAlign: 'center', marginTop: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { fontSize: 18, padding: 8, backgroundColor: '#0D1317', borderRadius: 10 },
  itemTitle: { color: '#F2F4F7', fontSize: 13, fontWeight: 'bold' },
  itemSub: { color: '#5e8278', fontSize: 10 },
  themeSelector: { flexDirection: 'row', backgroundColor: '#0D1317', padding: 4, borderRadius: 10, gap: 4 },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  themeBtnActive: { backgroundColor: '#00b87c' },
  themeBtnText: { color: '#5e8278', fontSize: 10, fontWeight: 'bold' },
  themeBtnTextActive: { color: '#0D1317' },
  prefItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  resetBtn: { backgroundColor: 'rgba(255, 75, 75, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  resetBtnText: { color: '#FF4B4B', fontSize: 11, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#FF4B4B', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  logoutBtnText: { color: '#FFF', fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#5e8278', fontSize: 10, marginTop: 30 },
});

export default ProfileView;
