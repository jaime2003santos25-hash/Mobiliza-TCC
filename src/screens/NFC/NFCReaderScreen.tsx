import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import cardService from '../../services/cardService';
import NfcValidator from '../../components/NfcValidator';
import ScreenWrapper from '../../components/ScreenWrapper';

const NFCReaderScreen: React.FC = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [cardName, setCardName] = useState('Bilhete Único');
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      const data = await cardService.getMeuSaldo();
      setBalance(data.saldo);
    } catch (error) {
      console.log('Erro ao carregar saldo para NFC:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, []),
  );

  const handleValidationSuccess = () => {
    setBalance(prev => prev - 4.40);
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
      <NfcValidator
        onBack={() => navigation.goBack()}
        balance={balance}
        activeCardName={cardName}
        isOnline={true}
        onSuccess={handleValidationSuccess}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0D1317', justifyContent: 'center', alignItems: 'center' }
});

export default NFCReaderScreen;
