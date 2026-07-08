import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Plus, CreditCard } from 'lucide-react-native';
import UserTicketCard from '../UserTicketCard';
import { CardItem } from '../../types';

interface CardsViewProps {
  cards: CardItem[];
  activeCardId: string;
  onSetActive: (id: string) => void;
  onAddCard: (card: Omit<CardItem, 'id'>) => void;
  onDeleteCard: (id: string) => void;
}

const CardsView: React.FC<CardsViewProps> = ({
  cards,
  activeCardId,
}) => {
  const activeCard = cards.find(c => c.active) || cards[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minha Carteira</Text>
          <Text style={styles.headerSub}>Gerencie seus cartões de transporte</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
           <Plus size={24} color="#00b87c" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>CARTÃO EM USO</Text>

        <UserTicketCard
          userName={activeCard.name.includes('Bilhete') ? 'JAYME' : activeCard.name}
          cardNumber={activeCard.number}
          expiryDate={activeCard.expiryDate}
          balance={activeCard.balance}
          showBalance={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  headerSub: { fontSize: 13, color: '#7fa89e', marginTop: 4 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(0,184,124,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,184,124,0.2)'
  },
  content: { paddingBottom: 120 },
  sectionLabel: {
    color: '#5e8278',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    paddingHorizontal: 24,
    marginBottom: 20,
    marginTop: 10
  },
});

export default CardsView;
