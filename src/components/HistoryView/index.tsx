import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {
  Search,
  TrainFront,
  Bus,
  PlusCircle,
  Clock
} from 'lucide-react-native';
import { TripItem } from '../../types';

interface HistoryViewProps {
  trips: TripItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ trips }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'metro' | 'bus' | 'recharge'>('all');

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || trip.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const groupedTrips: { [key: string]: TripItem[] } = {};
  filteredTrips.forEach(trip => {
    if (!groupedTrips[trip.date]) groupedTrips[trip.date] = [];
    groupedTrips[trip.date].push(trip);
  });

  const sortedDates = Object.keys(groupedTrips).sort((a, b) => {
    const [da, ma, ya] = a.split('/').map(Number);
    const [db, mb, yb] = b.split('/').map(Number);
    return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <Text style={styles.headerSub}>Suas atividades recentes</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color="#5e8278" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar viagens..."
            placeholderTextColor="#5e8278"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'TODOS' },
            { id: 'metro', label: 'METRÔ' },
            { id: 'bus', label: 'ÔNIBUS' },
            { id: 'recharge', label: 'RECARGA' }
          ].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setFilterType(filter.id as any)}
              style={[styles.filterChip, filterType === filter.id && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, filterType === filter.id && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {sortedDates.map(date => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{date}</Text>
            {groupedTrips[date].map(trip => (
              <View key={trip.id} style={styles.tripItem}>
                <View style={styles.tripIconBox}>
                  {trip.type === 'metro' && <TrainFront size={18} color="#00b87c" />}
                  {trip.type === 'bus' && <Bus size={18} color="#00b87c" />}
                  {trip.type === 'recharge' && <PlusCircle size={18} color="#3498db" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tripTitle}>{trip.title}</Text>
                  <View style={styles.timeRow}>
                    <Clock size={10} color="#7fa89e" />
                    <Text style={styles.tripTime}>08:15</Text>
                  </View>
                </View>
                <Text style={[styles.tripPrice, { color: trip.type === 'recharge' ? '#3498db' : '#FFF' }]}>
                  {trip.type === 'recharge' ? '+' : '-'} R$ {trip.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  header: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#7fa89e', marginTop: 4 },
  searchSection: { paddingHorizontal: 24, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2227',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  searchInput: { flex: 1, height: 48, color: '#FFF' },
  filterSection: { marginBottom: 20 },
  filterScroll: { paddingHorizontal: 24, gap: 10 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1A2227',
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  filterChipActive: { backgroundColor: '#00b87c', borderColor: '#00b87c' },
  filterText: { color: '#7fa89e', fontSize: 11, fontWeight: 'bold' },
  filterTextActive: { color: '#0D1317' },
  listContent: { paddingHorizontal: 24, paddingBottom: 120 },
  dateGroup: { marginBottom: 24 },
  dateLabel: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', marginBottom: 16 },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2227',
    padding: 16,
    borderRadius: 24,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  tripIconBox: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tripTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  tripTime: { color: '#7fa89e', fontSize: 10 },
  tripPrice: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});

export default HistoryView;
