import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import travelService from '../../services/travelService';
import HistoryView, { TripItem } from '../../components/HistoryView';
import ScreenWrapper from '../../components/ScreenWrapper';

const TravelHistoryScreen: React.FC = () => {
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarHistorico = async () => {
    try {
      const data = await travelService.getHistorico();
      const mappedTrips: TripItem[] = data.map(t => ({
        id: t.id.toString(),
        title: 'Ônibus - Mobiliza',
        date: '15/05/2024 - 08:15',
        price: 4.40,
        type: 'bus'
      }));

      const exampleTrips: TripItem[] = [
        { id: 'e1', title: 'Metrô - Estação Sé', date: 'Hoje - 08:30', price: 4.40, type: 'metro' },
        { id: 'e2', title: 'Recarga via Pix', date: 'Hoje - 12:00', price: 50.00, type: 'recharge' },
        { id: 'e3', title: 'Ônibus L200', date: 'Ontem - 18:15', price: 4.40, type: 'bus' },
      ];

      setTrips([...exampleTrips, ...mappedTrips]);
    } catch (error) {
      console.log('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, []),
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <HistoryView trips={trips} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center' }
});

export default TravelHistoryScreen;
