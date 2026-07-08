import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Wifi } from 'lucide-react-native';

interface UserTicketCardProps {
  userName: string;
  cardNumber: string;
  expiryDate?: string;
  balance?: number;
  showBalance?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 210;

const UserTicketCard: React.FC<UserTicketCardProps> = ({
  userName,
  cardNumber,
  expiryDate = '12/30',
  balance = 45.30,
  showBalance = false
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoM}>M</Text>
            </View>
            <Text style={styles.logoText}>MOBILIZA</Text>
          </View>
          <Wifi size={24} color="#FFF" style={{ opacity: 0.8, transform: [{ rotate: '90deg' }] }} />
        </View>

        <View style={styles.chipRow}>
          <View style={styles.chip} />
          <Wifi size={16} color="#FFF" style={{ opacity: 0.6, transform: [{ rotate: '90deg' }] }} />
        </View>

        <View style={styles.numberRow}>
          <Text style={styles.cardNumberText}>{cardNumber || '•••• •••• •••• 5320'}</Text>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.label}>TITULAR</Text>
            <Text style={styles.value}>{userName.toUpperCase() || 'JAYME'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>VALIDADE</Text>
            <Text style={styles.value}>{expiryDate}</Text>
          </View>
        </View>
      </View>

      {showBalance && (
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Saldo atual no bilhete</Text>
          <Text style={styles.balanceValue}>R$ {balance.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, alignSelf: 'center', marginVertical: 10 },
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 28,
    backgroundColor: '#005f4b', // Dark Emerald correct
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoIcon: { width: 28, height: 28, backgroundColor: '#1bdbe0', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  logoM: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  logoText: { color: '#FFF', fontWeight: 'bold', fontSize: 18, letterSpacing: 1.5 },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: { width: 50, height: 38, backgroundColor: '#d4af37', borderRadius: 8, opacity: 0.9 },
  numberRow: { marginTop: 12 },
  cardNumberText: { color: '#FFF', fontSize: 24, fontWeight: '600', letterSpacing: 3, fontFamily: 'monospace' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { color: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 4 },
  value: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  balanceContainer: { marginTop: 32, alignItems: 'center' },
  balanceLabel: { color: '#7fa89e', fontSize: 14, marginBottom: 10 },
  balanceValue: { color: '#FFF', fontSize: 48, fontWeight: 'bold' },
});

export default UserTicketCard;
