import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
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
      setViagens(historicoData);
      if (emailSalvo) setNome(emailSalvo.split('@')[0]);
    } catch (error) {
      console.log('Erro ao carregar dados da Home:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Recarrega os dados toda vez que a tela ganha foco
  // (ex: voltar de uma recarga de saldo)
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

  const formatarData = (isoDate: string) => {
    const data = new Date(isoDate);
    return data.toLocaleDateString('pt-BR') + ' - ' +
      data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const mascaraCartao = (numero: string) =>
    numero ? `•••• ${numero.slice(-4)}` : '';

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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#0DB39E"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {nome || 'usuário'}!</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>
          {saldo !== null ? formatarMoeda(saldo) : '--'}
        </Text>
        <Text style={styles.cardNumber}>
          Bilhete Único {mascaraCartao(numeroCartao)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.rechargeButton}
        onPress={() => navigation.navigate('Recharge')}
      >
        <Text style={styles.rechargeButtonText}>Recarregar</Text>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Histórico de viagens</Text>

        {viagens.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Você ainda não fez nenhuma viagem.
            </Text>
          </View>
        ) : (
          viagens.map((viagem) => (
            <View key={viagem.id} style={styles.travelItem}>
              <View>
                <Text style={styles.travelDate}>
                  {formatarData(viagem.dataHora)}
                </Text>
              </View>
              <Text style={styles.travelValue}>
                {formatarMoeda(viagem.valor)}
              </Text>
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
    backgroundColor: '#0D1B1E',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0D1B1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F2F4F7',
  },
  balanceCard: {
    backgroundColor: '#0c2b27',
    borderWidth: 1,
    borderColor: '#1d4a42',
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 20,
  },
  balanceLabel: {
    color: '#5DCAA5',
    fontSize: 13,
  },
  balanceValue: {
    color: '#F2F4F7',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  cardNumber: {
    color: '#7fa89e',
    fontSize: 13,
    marginTop: 12,
  },
  rechargeButton: {
    backgroundColor: '#0DB39E',
    borderRadius: 12,
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rechargeButtonText: {
    color: '#0D1B1E',
    fontWeight: '700',
    fontSize: 15,
  },
  historySection: {
    marginTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#F2F4F7',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#5e8278',
    fontSize: 14,
  },
  travelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0c1f1c',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  travelDate: {
    color: '#F2F4F7',
    fontSize: 13,
  },
  travelValue: {
    color: '#0DB39E',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default HomeScreen;
