import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ProfileView, { UserProfile } from '../../components/ProfileView';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Jayme',
    email: '',
    notificationOn: true,
    biometricOn: false,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const email = await AsyncStorage.getItem('@mobiliza:email');
      setProfile(prev => ({ ...prev, email: email || '', name: email?.split('@')[0] || 'Jayme' }));
      setLoading(false);
    };
    carregarDados();
  }, []);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <ProfileView
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        tripCount={42} // Exemplo de valor para o gráfico eco
        onLogout={handleLogout}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center' }
});

export default ProfileScreen;
