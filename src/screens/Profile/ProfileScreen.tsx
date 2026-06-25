import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getEmail = async () => {
      const savedEmail = await AsyncStorage.getItem('@mobiliza:email');
      if (savedEmail) setEmail(savedEmail);
    };
    getEmail();
  }, []);

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair do aplicativo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await AsyncStorage.multiRemove(['@mobiliza:token', '@mobiliza:email']);
          navigation.replace('Auth');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{email ? email[0].toUpperCase() : 'U'}</Text>
        </View>
        <Text style={styles.userName}>{email.split('@')[0] || 'Usuário'}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conta</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Meus Dados</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.menuItemText}>Alterar Senha</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notificações</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacidade</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Versão 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B1E',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#1d4a42',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0DB39E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0D1B1E',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F2F4F7',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#5DCAA5',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5e8278',
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1d4a42',
  },
  menuItemText: {
    fontSize: 16,
    color: '#F2F4F7',
  },
  chevron: {
    fontSize: 24,
    color: '#0DB39E',
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 48,
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    borderWidth: 1,
    borderColor: '#FF4B4B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FF4B4B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  versionText: {
    textAlign: 'center',
    color: '#5e8278',
    fontSize: 12,
    marginVertical: 40,
  },
});

export default ProfileScreen;
