import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import cardService from '../../services/cardService';
import travelService, { ViagemResponse } from '../../services/travelService';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState<number | null>(null);
  const [numeroCartao, setNumeroCartao] = useState('');
  const [viagens, setViagens] = useState<ViagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const [saldoData, historicoData, emailSalvo] = await Promise.all([
        cardService.getMeuSaldo(),
        travelService.getHistorico(),
        AsyncStorage.getItem('@mobiliza:email'),
      ]);

      setSaldo(saldoData.saldo);
      setNumeroCartao(saldoData.numeroCartao);
      setViagens(historicoData.slice(0, 3)); // Mostrar apenas as 3 últimas
      if (emailSalvo) setNome(emailSalvo.split('@')[0]);
    } catch (error) {
      console.log('Erro ao carregar dados da Home:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0DB39E" />
      }
    >
      {/* Header com Saudação */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {nome || 'Jayme'}! 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Text style={styles.bellIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Card de Saldo */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo atual</Text>
          <Text style={styles.nfcIconSmall}>📶</Text>
        </View>
        <Text style={styles.balanceValue}>
          {saldo !== null ? formatarMoeda(saldo) : 'R$ 0,00'}
        </Text>
        <TouchableOpacity
          style={styles.rechargeBtnInside}
          onPress={() => navigation.navigate('Recharge')}
        >
          <Text style={styles.rechargeBtnText}>Recarregar</Text>
        </TouchableOpacity>
      </View>

      {/* Grid de Ações Rápidas */}
      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('TravelHistory')}>
          <View style={styles.actionIconBg}><Text style={styles.actionIcon}>🕒</Text></View>
          <Text style={styles.actionText}>Histórico de viagens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <View style={styles.actionIconBg}><Text style={styles.actionIcon}>💳</Text></View>
          <Text style={styles.actionText}>Meus cartões</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Recharge')}>
          <View style={styles.actionIconBg}><Text style={styles.actionIcon}>📁</Text></View>
          <Text style={styles.actionText}>Recarga</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.actionIconBg}><Text style={styles.actionIcon}>⚙️</Text></View>
          <Text style={styles.actionText}>Configurações</Text>
        </TouchableOpacity>
      </View>

      {/* Card Informativo NFC */}
      <TouchableOpacity style={styles.nfcPromoCard} onPress={() => navigation.navigate('NFC')}>
        <View style={styles.nfcPromoIcon}>
          <Text style={styles.phoneIcon}>📱</Text>
        </View>
        <View style={styles.nfcPromoContent}>
          <Text style={styles.nfcPromoTitle}>Aproxime e passe</Text>
          <Text style={styles.nfcPromoSubtitle}>Use o NFC para validar sua passagem de forma rápida e segura.</Text>
        </View>
        <Text style={styles.chevronRight}>›</Text>
      </TouchableOpacity>

      {/* Seção de Últimas Viagens */}
      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas viagens</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TravelHistory')}>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {viagens.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma viagem recente.</Text>
        ) : (
          viagens.map((viagem) => (
            <View key={viagem.id} style={styles.travelItem}>
              <View style={styles.travelIconContainer}>
                <Text style={styles.busIcon}>🚌</Text>
              </View>
              <View style={styles.travelDetails}>
                <Text style={styles.travelLocation}>Ônibus - Mobiliza</Text>
                <Text style={styles.travelDate}>15/05/2024 - 08:15</Text>
              </View>
              <Text style={styles.travelValue}>R$ 4,40</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1317', // Cor de fundo do print
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D1317',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F2F4F7',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A2227',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: { fontSize: 20 },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0DB39E',
    borderWidth: 1.5,
    borderColor: '#1A2227',
  },
  balanceCard: {
    backgroundColor: '#1A2227',
    borderRadius: 24,
    marginHorizontal: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: { color: '#7fa89e', fontSize: 14 },
  nfcIconSmall: { fontSize: 18, color: '#0DB39E' },
  balanceValue: {
    color: '#F2F4F7',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  rechargeBtnInside: {
    backgroundColor: '#0DB39E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rechargeBtnText: { color: '#0D1317', fontWeight: 'bold', fontSize: 16 },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  actionItem: {
    width: '45%',
    backgroundColor: '#1A2227',
    margin: '2.5%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 179, 158, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: { fontSize: 20 },
  actionText: {
    color: '#F2F4F7',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  nfcPromoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2227',
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  nfcPromoIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0D1317',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  phoneIcon: { fontSize: 24 },
  nfcPromoContent: { flex: 1 },
  nfcPromoTitle: { color: '#0DB39E', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  nfcPromoSubtitle: { color: '#7fa89e', fontSize: 12, lineHeight: 18 },
  chevronRight: { color: '#0DB39E', fontSize: 24, marginLeft: 8 },
  historySection: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { color: '#F2F4F7', fontSize: 18, fontWeight: 'bold' },
  seeAllText: { color: '#0DB39E', fontSize: 14, fontWeight: '600' },
  travelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2227',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  travelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 179, 158, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  busIcon: { fontSize: 20 },
  travelDetails: { flex: 1 },
  travelLocation: { color: '#F2F4F7', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  travelDate: { color: '#7fa89e', fontSize: 12 },
  travelValue: { color: '#F2F4F7', fontSize: 15, fontWeight: 'bold' },
  emptyText: { color: '#7fa89e', textAlign: 'center', marginTop: 20 },
});

export default HomeScreen;
