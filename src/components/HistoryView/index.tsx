import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { TripItem } from '../../types';

interface HistoryViewProps {
  trips: TripItem[];
}

const { width } = Dimensions.get('window');

const HistoryView: React.FC<HistoryViewProps> = ({ trips }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'metro' | 'bus' | 'recharge'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<TripItem | null>(null);

  // Lógica para o gráfico de 7 dias
  const getLast7DaysData = () => {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = weekdays[d.getDay()];
      // Simulação de gastos para o gráfico (pode ser conectado aos dados reais depois)
      const randomSpent = Math.random() * 50;
      data.push({ name: dayName, spent: randomSpent });
    }
    return data;
  };

  const chartData = getLast7DaysData();
  const maxSpent = Math.max(...chartData.map(d => d.spent), 1);

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || trip.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Histórico de Viagens</Text>
        <Text style={styles.subtitle}>Veja seus deslocamentos e recargas recentes.</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Viagens</Text>
          <Text style={[styles.statValue, { color: '#0DB39E' }]}>{trips.filter(t => t.type !== 'recharge').length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Pago</Text>
          <Text style={styles.statValue}>R$ {trips.filter(t => t.type !== 'recharge').reduce((acc, t) => acc + t.price, 0).toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Recargas</Text>
          <Text style={[styles.statValue, { color: '#3498db' }]}>R$ {trips.filter(t => t.type === 'recharge').reduce((acc, t) => acc + t.price, 0).toFixed(2)}</Text>
        </View>
      </View>

      {/* Custom Bar Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Consumo dos últimos 7 dias</Text>
        <View style={styles.chartContainer}>
          {chartData.map((day, index) => (
            <View key={index} style={styles.chartBarWrapper}>
              <View style={[styles.chartBar, { height: (day.spent / maxSpent) * 80 + 5 }]} />
              <Text style={styles.chartDayText}>{day.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por estação ou linha..."
          placeholderTextColor="#5e8278"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {['all', 'metro', 'bus', 'recharge'].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type as any)}
              style={[styles.pill, filterType === type && styles.pillActive]}
            >
              <Text style={[styles.pillText, filterType === type && styles.pillTextActive]}>
                {type === 'all' ? 'Todos' : type === 'metro' ? 'Metrô' : type === 'bus' ? 'Ônibus' : 'Recargas'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trips List */}
      <View style={styles.listSection}>
        {filteredTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripItem}
            onPress={() => setSelectedReceipt(trip)}
          >
            <View style={styles.tripIconBg}>
              <Text style={styles.tripIcon}>{trip.type === 'recharge' ? '💰' : trip.type === 'metro' ? '🚇' : '🚌'}</Text>
            </View>
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle}>{trip.title}</Text>
              <Text style={styles.tripDate}>{trip.date}</Text>
            </View>
            <Text style={[styles.tripPrice, trip.type === 'recharge' ? styles.pricePlus : styles.priceMinus]}>
              {trip.type === 'recharge' ? '+' : '-'} R$ {trip.price.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Receipt Modal */}
      <Modal visible={!!selectedReceipt} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Comprovante de Viagem</Text>
            {selectedReceipt && (
              <View style={styles.receiptBody}>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Transação</Text><Text style={styles.receiptValue}>{selectedReceipt.type.toUpperCase()}</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Local</Text><Text style={styles.receiptValue}>{selectedReceipt.title}</Text></View>
                <View style={styles.receiptRow}><Text style={styles.receiptLabel}>Data</Text><Text style={styles.receiptValue}>{selectedReceipt.date}</Text></View>
                <View style={styles.divider} />
                <View style={styles.receiptRow}><Text style={styles.receiptLabelTotal}>Valor</Text><Text style={styles.receiptValueTotal}>R$ {selectedReceipt.price.toFixed(2)}</Text></View>
              </View>
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedReceipt(null)}>
              <Text style={styles.closeBtnText}>Fechar Recibo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  content: { padding: 24 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#F2F4F7' },
  subtitle: { fontSize: 13, color: '#5e8278', marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1A2227', padding: 12, borderRadius: 16, marginHorizontal: 4, borderWidth: 1, borderColor: '#2D373D' },
  statLabel: { fontSize: 10, color: '#5e8278', fontWeight: 'bold', textTransform: 'uppercase' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#F2F4F7', marginTop: 4 },
  chartCard: { backgroundColor: '#1A2227', padding: 20, borderRadius: 24, marginBottom: 24, borderWidth: 1, borderColor: '#2D373D' },
  chartTitle: { color: '#F2F4F7', fontSize: 14, fontWeight: 'bold', marginBottom: 20 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
  chartBarWrapper: { alignItems: 'center', width: 30 },
  chartBar: { width: 12, backgroundColor: '#0DB39E', borderRadius: 6 },
  chartDayText: { color: '#5e8278', fontSize: 10, marginTop: 8 },
  filterSection: { marginBottom: 24 },
  searchInput: { backgroundColor: '#1A2227', borderRadius: 12, padding: 12, color: '#F2F4F7', marginBottom: 12, borderWidth: 1, borderColor: '#2D373D' },
  pillsScroll: { flexDirection: 'row' },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1A2227', marginRight: 8, borderWidth: 1, borderColor: '#2D373D' },
  pillActive: { backgroundColor: 'rgba(13, 179, 158, 0.1)', borderColor: '#0DB39E' },
  pillText: { color: '#5e8278', fontSize: 12, fontWeight: 'bold' },
  pillTextActive: { color: '#0DB39E' },
  listSection: { gap: 12 },
  tripItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A2227', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#2D373D' },
  tripIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tripIcon: { fontSize: 20 },
  tripInfo: { flex: 1 },
  tripTitle: { color: '#F2F4F7', fontSize: 14, fontWeight: 'bold' },
  tripDate: { color: '#5e8278', fontSize: 11, marginTop: 2 },
  tripPrice: { fontSize: 14, fontWeight: 'bold' },
  priceMinus: { color: '#F2F4F7' },
  pricePlus: { color: '#3498db' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { backgroundColor: '#1A2227', borderRadius: 30, padding: 24, width: '100%', borderWidth: 1, borderColor: '#2D373D' },
  modalHeader: { color: '#F2F4F7', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  receiptBody: { backgroundColor: '#0D1317', borderRadius: 20, padding: 20 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  receiptLabel: { color: '#5e8278', fontSize: 12 },
  receiptValue: { color: '#F2F4F7', fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#2D373D', marginVertical: 12 },
  receiptLabelTotal: { color: '#0DB39E', fontWeight: 'bold' },
  receiptValueTotal: { color: '#0DB39E', fontSize: 16, fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#2D373D', padding: 16, borderRadius: 16, marginTop: 24, alignItems: 'center' },
  closeBtnText: { color: '#F2F4F7', fontWeight: 'bold' },
});

export default HistoryView;
