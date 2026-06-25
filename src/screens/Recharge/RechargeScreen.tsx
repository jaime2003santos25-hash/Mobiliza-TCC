import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import cardService from '../../services/cardService';
import ScreenWrapper from '../../components/ScreenWrapper';
import RechargeModal from '../../components/RechargeModal';
import { CardItem } from '../../components/CardsView';

const RechargeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [activeCardId, setActiveCardId] = useState('');

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSuccess = (amount: number, cardId: string) => {
    console.log(`Recarga de R$ ${amount} no cartão ${cardId} realizada!`);
    // Aqui você pode adicionar a chamada ao backend se quiser persistir
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0DB39E" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <RechargeModal
          isOpen={true} // Aberto por padrão pois esta é a tela de recarga
          onClose={() => navigation.goBack()}
          cards={cards}
          activeCardId={activeCardId}
          onRechargeSuccess={handleSuccess}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center' }
});

export default RechargeScreen;
