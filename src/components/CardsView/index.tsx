import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
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
  onSetActive,
  onAddCard,
  onDeleteCard
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'virtual' | 'physical'>('virtual');

  const handleSubmit = () => {
    if (!newName.trim()) {
      Alert.alert('Erro', 'Dê um nome ao seu cartão.');
      return;
    }

    onAddCard({
      name: newName,
      number: `•••• •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      balance: 0.00,
      color: 'from-emerald-500 to-teal-700',
      active: false,
      type: newType,
      expiryDate: '12/30'
    });

    setNewName('');
    setIsAdding(false);
  };

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];
  const otherCards = cards.filter(c => c.id !== activeCardId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus cartões</Text>
      </View>

      {isAdding && (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>NOVO CARTÃO DE TRANSPORTE</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apelido do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Bilhete Único, Estudante"
              placeholderTextColor="#5e8278"
              value={newName}
              onChangeText={setNewName}
            />
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.typeBtn, newType === 'virtual' && styles.typeBtnActive]}
              onPress={() => setNewType('virtual')}
            >
              <Text style={[styles.typeBtnText, newType === 'virtual' && styles.typeBtnTextActive]}>Virtual (NFC)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, newType === 'physical' && styles.typeBtnActive]}
              onPress={() => setNewType('physical')}
            >
              <Text style={[styles.typeBtnText, newType === 'physical' && styles.typeBtnTextActive]}>Físico</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsAdding(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <Text style={styles.saveBtnText}>Salvar Cartão</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>Cartão Ativo</Text>
      {activeCard && (
        <UserTicketCard
          userName={activeCard.name}
          cardNumber={activeCard.number}
        />
      )}

      <View style={styles.securityBox}>
        <Text style={styles.securityTitle}>🛡️ Dica de Segurança</Text>
        <Text style={styles.securityText}>
          Nunca compartilhe o número do seu bilhete. Em caso de perda, bloqueie imediatamente.
        </Text>
      </View>

      {!isAdding && (
        <TouchableOpacity style={styles.addCardDashed} onPress={() => setIsAdding(true)}>
          <Text style={styles.addCardDashedText}>+ Vincular novo cartão</Text>
        </TouchableOpacity>
      )}

      {otherCards.length > 0 && (
        <View style={styles.othersSection}>
          <Text style={styles.othersLabel}>Outros Cartões Vinculados</Text>
          {otherCards.map(card => (
            <View key={card.id} style={styles.otherCardItem}>
              <View style={styles.otherCardInfo}>
                <View style={styles.dot} />
                <View>
                  <Text style={styles.otherCardName}>{card.name}</Text>
                  <Text style={styles.otherCardNumber}>{card.number}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.activateBtn} onPress={() => onSetActive(card.id)}>
                <Text style={styles.activateBtnText}>Ativar NFC</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  content: { padding: 24, paddingBottom: 60 },
  header: { paddingVertical: 10, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#F2F4F7' },
  addForm: {
    backgroundColor: '#1A2227',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2D373D',
  },
  formTitle: { color: '#F2F4F7', fontSize: 10, fontWeight: 'bold', marginBottom: 16, letterSpacing: 1 },
  inputGroup: { marginBottom: 16 },
  label: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' },
  input: {
    backgroundColor: '#0D1317',
    borderWidth: 1,
    borderColor: '#2D373D',
    borderRadius: 12,
    padding: 12,
    color: '#F2F4F7',
  },
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D373D',
    alignItems: 'center',
  },
  typeBtnActive: { backgroundColor: '#00b87c', borderColor: '#00b87c' },
  typeBtnText: { color: '#7fa89e', fontWeight: 'bold', fontSize: 12 },
  typeBtnTextActive: { color: '#0D1317' },
  formActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, padding: 14, alignItems: 'center' },
  cancelBtnText: { color: '#7fa89e', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#00b87c', padding: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#0D1317', fontWeight: 'bold' },
  sectionLabel: { color: '#00b87c', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  securityBox: {
    backgroundColor: 'rgba(0, 184, 124, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 184, 124, 0.1)',
  },
  securityTitle: { color: '#F2F4F7', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  securityText: { color: '#7fa89e', fontSize: 11, lineHeight: 18 },
  addCardDashed: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 184, 124, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addCardDashedText: { color: '#00b87c', fontWeight: 'bold', fontSize: 14 },
  othersSection: { marginTop: 32 },
  othersLabel: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 16 },
  otherCardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A2227',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
  },
  otherCardInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00b87c' },
  otherCardName: { color: '#F2F4F7', fontSize: 14, fontWeight: 'bold' },
  otherCardNumber: { color: '#7fa89e', fontSize: 11, fontFamily: 'monospace' },
  activateBtn: { padding: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#00b87c' },
  activateBtnText: { color: '#00b87c', fontSize: 10, fontWeight: 'bold' },
});

export default CardsView;
