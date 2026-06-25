import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import cardService from '../../services/cardService';

const BalanceScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [numeroCartao, setNumeroCartao] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarDados = async () => {
    try {
      const data = await cardService.getMeuSaldo();
      setSaldo(data.saldo);
      setNumeroCartao(data.numeroCartao);
    } catch (error) {
      console.log('Erro ao carregar saldo:', error);
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
      <View style={styles.header}>
        <Text style={styles.title}>Meu Saldo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Disponível para uso</Text>
        <Text style={styles.value}>
          {saldo !== null ? formatarMoeda(saldo) : '--'}
        </Text>
        <View style={styles.divider} />
        <View style={styles.cardInfo}>
          <Text style={styles.infoLabel}>Cartão:</Text>
          <Text style={styles.infoValue}>{numeroCartao || 'Não vinculado'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.rechargeButton}
        onPress={() => navigation.navigate('Recharge')}
      >
        <Text style={styles.rechargeButtonText}>RECARREGAR AGORA</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>Dica Mobiliza</Text>
        <Text style={styles.infoBoxText}>
          As recargas feitas via cartão de crédito caem na hora. Boletos podem levar até 2 dias úteis.
        </Text>
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
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2F4F7',
  },
  card: {
    backgroundColor: '#0c2b27',
    borderRadius: 20,
    marginHorizontal: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1d4a42',
    elevation: 4,
  },
  label: {
    color: '#5DCAA5',
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    color: '#F2F4F7',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#1d4a42',
    marginBottom: 20,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#5e8278',
    fontSize: 14,
  },
  infoValue: {
    color: '#F2F4F7',
    fontSize: 14,
    fontWeight: '500',
  },
  rechargeButton: {
    backgroundColor: '#0DB39E',
    marginHorizontal: 24,
    marginTop: 32,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0DB39E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rechargeButtonText: {
    color: '#0D1B1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    margin: 24,
    padding: 20,
    backgroundColor: 'rgba(93, 202, 165, 0.05)',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0DB39E',
  },
  infoBoxTitle: {
    color: '#F2F4F7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoBoxText: {
    color: '#7fa89e',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default BalanceScreen;
