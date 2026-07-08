import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { CardItem } from '../../types';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess: (amount: number, cardId: string) => void;
  cards: CardItem[];
  activeCardId: string;
}

const { height } = Dimensions.get('window');

const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  onRechargeSuccess,
  cards,
  activeCardId
}) => {
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [amount, setAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(activeCardId);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [copied, setCopied] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount.replace(',', '.')) : amount;
  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  const handleConfirmRecharge = () => {
    if (finalAmount <= 0) return;
    setStep('payment');
  };

  const handleSimulatePayment = () => {
    onRechargeSuccess(finalAmount, selectedCardId);
    setStep('success');
  };

  const handleClose = () => {
    setStep('select');
    setCustomAmount('');
    onClose();
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={handleClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recarregar Cartão</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={{color: '#FFF', fontSize: 20}}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {step === 'select' && (
              <View>
                <Text style={styles.label}>Destino da Recarga</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
                  {cards.map(card => (
                    <TouchableOpacity
                      key={card.id}
                      onPress={() => setSelectedCardId(card.id)}
                      style={[styles.cardItem, selectedCardId === card.id && styles.cardItemActive]}
                    >
                      <View style={styles.cardDot} />
                      <View>
                        <Text style={styles.cardName}>{card.name}</Text>
                        <Text style={styles.cardNumber}>{card.number}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.label}>Selecione o valor</Text>
                <View style={styles.grid}>
                  {[10, 20, 50, 100].map(val => (
                    <TouchableOpacity
                      key={val}
                      onPress={() => { setAmount(val); setCustomAmount(''); }}
                      style={[styles.valBtn, amount === val && !customAmount && styles.valBtnActive]}
                    >
                      <Text style={[styles.valText, amount === val && !customAmount && styles.valTextActive]}>R$ {val}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Ou digite outro valor</Text>
                <TextInput
                  style={styles.input}
                  placeholder="R$ 0,00"
                  placeholderTextColor="#5e8278"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                />

                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>Total a pagar:</Text>
                  <Text style={styles.summaryValue}>R$ {finalAmount.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.mainBtn} onPress={handleConfirmRecharge}>
                  <Text style={styles.mainBtnText}>Continuar para Pagamento</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'payment' && (
              <View>
                <View style={styles.paymentTabs}>
                  <TouchableOpacity
                    style={[styles.tab, paymentMethod === 'pix' && styles.tabActive]}
                    onPress={() => setPaymentMethod('pix')}
                  >
                    <Text style={[styles.tabText, paymentMethod === 'pix' && styles.tabTextActive]}>💎 PIX</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, paymentMethod === 'card' && styles.tabActive]}
                    onPress={() => setPaymentMethod('card')}
                  >
                    <Text style={[styles.tabText, paymentMethod === 'card' && styles.tabTextActive]}>💳 Cartão</Text>
                  </TouchableOpacity>
                </View>

                {paymentMethod === 'pix' ? (
                  <View style={styles.pixArea}>
                    <View style={styles.qrPlaceholder}>
                      <Text style={{fontSize: 50}}>📱</Text>
                    </View>
                    <Text style={styles.pixInfo}>Copie o código abaixo para pagar R$ {finalAmount.toFixed(2)} no seu banco.</Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                      <Text style={styles.copyBtnText}>{copied ? '✅ Código Copiado!' : '📋 Copiar Código Pix'}</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.cardForm}>
                    <TextInput style={styles.input} placeholder="Número do Cartão" placeholderTextColor="#5e8278" keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Nome Impresso" placeholderTextColor="#5e8278" />
                    <View style={styles.row}>
                      <TextInput style={[styles.input, {flex: 1}]} placeholder="Validade" placeholderTextColor="#5e8278" />
                      <TextInput style={[styles.input, {flex: 1}]} placeholder="CVV" placeholderTextColor="#5e8278" keyboardType="numeric" />
                    </View>
                  </View>
                )}

                <View style={styles.row}>
                  <TouchableOpacity style={styles.backBtnAction} onPress={() => setStep('select')}>
                    <Text style={styles.backBtnActionText}>Voltar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mainBtn, {flex: 1}]} onPress={handleSimulatePayment}>
                    <Text style={styles.mainBtnText}>Pagar Agora</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 'success' && (
              <View style={styles.successArea}>
                <View style={styles.successIcon}><Text style={{fontSize: 40}}>✅</Text></View>
                <Text style={styles.successTitle}>Recarga Confirmada!</Text>
                <Text style={styles.successSub}>O saldo já foi atualizado no seu {selectedCard.name}.</Text>

                <View style={styles.finalSummary}>
                   <View><Text style={styles.sumLabel}>Valor</Text><Text style={styles.sumVal}>R$ {finalAmount.toFixed(2)}</Text></View>
                   <View style={{alignItems: 'flex-end'}}><Text style={styles.sumLabel}>Novo Saldo</Text><Text style={[styles.sumVal, {color: '#00b87c'}]}>R$ {(selectedCard.balance + finalAmount).toFixed(2)}</Text></View>
                </View>

                <TouchableOpacity style={styles.mainBtn} onPress={handleClose}>
                  <Text style={styles.mainBtnText}>Excelente!</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  dismissArea: { flex: 1 },
  sheet: { backgroundColor: '#10171d', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: height * 0.85, borderTopWidth: 1, borderColor: '#2D373D' },
  handle: { width: 50, height: 4, backgroundColor: '#2D373D', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 8, backgroundColor: '#1A2227', borderRadius: 20 },
  scrollContent: { paddingBottom: 40 },
  label: { color: '#5e8278', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  cardsScroll: { flexDirection: 'row', marginBottom: 24 },
  cardItem: { padding: 16, backgroundColor: '#1A2227', borderRadius: 16, marginRight: 10, borderWidth: 1, borderColor: '#2D373D', flexDirection: 'row', gap: 10, alignItems: 'center' },
  cardItemActive: { borderColor: '#00b87c', backgroundColor: 'rgba(0,184,124,0.05)' },
  cardDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00b87c' },
  cardName: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  cardNumber: { color: '#5e8278', fontSize: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  valBtn: { width: '23%', paddingVertical: 12, borderRadius: 12, backgroundColor: '#1A2227', alignItems: 'center', borderWidth: 1, borderColor: '#2D373D' },
  valBtnActive: { backgroundColor: '#00b87c', borderColor: '#00b87c' },
  valText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  valTextActive: { color: '#0D1317' },
  input: { backgroundColor: '#1A2227', padding: 16, borderRadius: 16, color: '#FFF', fontSize: 18, fontWeight: 'bold', borderWidth: 1, borderColor: '#2D373D', marginBottom: 24 },
  summary: { padding: 20, backgroundColor: '#0D1317', borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  summaryLabel: { color: '#5e8278', fontSize: 14 },
  summaryValue: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  mainBtn: {
    backgroundColor: '#00b87c',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    // Sombras para iOS
    shadowColor: '#00b87c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Sombra para Android
    elevation: 5
  },
  mainBtnText: { color: '#0D1317', fontWeight: 'bold', fontSize: 16 },
  paymentTabs: { flexDirection: 'row', backgroundColor: '#0D1317', padding: 6, borderRadius: 16, gap: 6, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#1A2227', borderWidth: 1, borderColor: '#2D373D' },
  tabText: { color: '#5e8278', fontWeight: 'bold', fontSize: 12 },
  tabTextActive: { color: '#00b87c' },
  pixArea: { alignItems: 'center', paddingVertical: 20 },
  qrPlaceholder: { width: 120, height: 120, backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: '#00b87c' },
  pixInfo: { color: '#5e8278', textAlign: 'center', fontSize: 12, marginBottom: 20, paddingHorizontal: 20 },
  copyBtn: { padding: 14, backgroundColor: '#1A2227', borderRadius: 12, borderWidth: 1, borderColor: '#00b87c' },
  copyBtnText: { color: '#00b87c', fontWeight: 'bold' },
  cardForm: { gap: 12, marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12 },
  backBtnAction: { padding: 18, justifyContent: 'center' },
  backBtnActionText: { color: '#5e8278', fontWeight: 'bold' },
  successArea: { alignItems: 'center', paddingVertical: 30 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,184,124,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#00b87c' },
  successTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  successSub: { color: '#5e8278', fontSize: 14, textAlign: 'center', marginBottom: 30 },
  finalSummary: { width: '100%', padding: 20, backgroundColor: '#0D1317', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  sumLabel: { color: '#5e8278', fontSize: 10, textTransform: 'uppercase', marginBottom: 4 },
  sumVal: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#2D373D', fontSize: 10, marginTop: 30 }
});

export default RechargeModal;
