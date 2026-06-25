import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import travelService, { ViagemResponse } from '../../services/travelService';

const TravelHistoryScreen: React.FC = () => {
  const [viagens, setViagens] = useState<ViagemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregarHistorico = async () => {
    try {
      const data = await travelService.getHistorico();
      setViagens(data);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, []),
  );

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatarData = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('pt-BR');
  };

  const formatarHora = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderItem = ({ item }: { item: ViagemResponse }) => (
    <View style={styles.item}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚌</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>Viagem de Ônibus</Text>
        <Text style={styles.dateTime}>{formatarData(item.dataHora)} às {formatarHora(item.dataHora)}</Text>
      </View>
      <Text style={styles.value}>- {formatarMoeda(item.valor)}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Extrato</Text>
        <Text style={styles.headerSubtitle}>Suas últimas movimentações</Text>
      </View>

      <FlatList
        data={viagens}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={carregarHistorico} tintColor="#0DB39E" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhuma viagem encontrada.</Text>
          </View>
        }
      />
    </View>
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
    backgroundColor: '#0D1B1E',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F2F4F7',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#5DCAA5',
    marginTop: 4,
  },
  list: {
    padding: 24,
    paddingTop: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c2b27',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1d4a42',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(13, 179, 158, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F2F4F7',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 13,
    color: '#7fa89e',
  },
  value: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF4B4B',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#5e8278',
    fontSize: 16,
  },
});

export default TravelHistoryScreen;
