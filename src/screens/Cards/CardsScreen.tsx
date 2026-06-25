import React, { useCallback, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cardService from '../../services/cardService';
import CardsView, { CardItem } from '../../components/CardsView';
import ScreenWrapper from '../../components/ScreenWrapper';

const CardsScreen: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [activeCardId, setActiveCardId] = useState('');
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      const [saldoData, emailSalvo] = await Promise.all([
        cardService.getMeuSaldo(),
        AsyncStorage.getItem('@mobiliza:email'),
      ]);

      const mainCard: CardItem = {
        id: '1',
        name: (emailSalvo?.split('@')[0] || 'Jayme').toUpperCase(),
        number: saldoData.numeroCartao,
        balance: saldoData.saldo,
        color: 'from-emerald-500 to-teal-700',
        type: 'virtual',
        expiryDate: '12/30'
      };

      setCards([mainCard]);
      setActiveCardId('1');
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  const handleAddCard = (newCard: Omit<CardItem, 'id'>) => {
    const cardWithId = { ...newCard, id: Date.now().toString() };
    setCards([...cards, cardWithId]);
    setActiveCardId(cardWithId.id);
  };

  const handleSetActive = (id: string) => setActiveCardId(id);
  const handleDeleteCard = (id: string) => setCards(cards.filter(c => c.id !== id));

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <CardsView
        cards={cards}
        activeCardId={activeCardId}
        onSetActive={handleSetActive}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center' }
});

export default CardsScreen;
