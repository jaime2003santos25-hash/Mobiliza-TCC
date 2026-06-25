import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import { TripItem } from '../../types';

interface NfcValidatorProps {
  onBack: () => void;
  balance: number;
  activeCardName: string;
  isOnline: boolean;
  onSuccess?: () => void;
  onDeductBalance?: (amount: number, newTrip: Omit<TripItem, 'id'>) => boolean;
}

const { width, height } = Dimensions.get('window');

const NfcValidator: React.FC<NfcValidatorProps> = ({
  onBack,
  balance,
  activeCardName,
  isOnline,
  onSuccess
}) => {
  const [status, setStatus] = useState<'ready' | 'validating' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');

  // Animações
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === 'ready') {
      // Animação de Flutuação do Cartão
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -15, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(floatAnim, { toValue: 0, duration: 2500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      ).start();

      // Animação de Pulso do Sensor
      const createPulse = (anim: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
              Animated.timing(anim, { toValue: 2, duration: 2000, useNativeDriver: true }),
              Animated.timing(anim, { toValue: 1, duration: 0, useNativeDriver: true }),
            ])
          ])
        ).start();
      };
      createPulse(pulseAnim1, 0);
      createPulse(pulseAnim2, 1000);
    }

    if (status === 'validating') {
      Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }
  }, [status]);

  const handleValidate = () => {
    if (status !== 'ready') return;
    setStatus('validating');

    setTimeout(() => {
      if (balance < 4.40) {
        setErrorMessage('Saldo Insuficiente! Recarregue para liberar.');
        setStatus('error');
      } else {
        setStatus('success');
        if (onSuccess) onSuccess();
        setTimeout(() => setStatus('ready'), 4000);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC - Validar</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Status Pill */}
      <View style={[styles.statusPill, { borderColor: isOnline ? '#00b87c' : '#f97316' }]}>
        <View style={[styles.dot, { backgroundColor: isOnline ? '#00b87c' : '#f97316' }]} />
        <Text style={[styles.statusText, { color: isOnline ? '#00b87c' : '#f97316' }]}>
          {isOnline ? 'Validador Online' : 'Validador Offline'}
        </Text>
      </View>

      <View style={styles.content}>
        {status === 'ready' && (
          <View style={styles.centerBox}>
            <Text style={styles.instruction}>Aproxime-se da catraca</Text>

            {/* Cartão Flutuante */}
            <Animated.View style={[styles.floatingCard, { transform: [{ translateY: floatAnim }] }]}>
              <View style={styles.cardHeader}>
                <View style={styles.chip} />
                <Text style={styles.contactless}>📶</Text>
              </View>
              <Image source={require('../../assets/images/logo_mobiliza.png')} style={styles.cardLogo} resizeMode="contain" />
              <View style={styles.cardFooter}>
                <Text style={styles.cardNumber}>•••• 9999</Text>
                <Text style={styles.cardBrand}>MOBILIZA</Text>
              </View>
            </Animated.View>

            {/* Sensor de Pulso */}
            <TouchableOpacity onPress={handleValidate} style={styles.sensorContainer}>
              <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim1 }], opacity: pulseAnim1.interpolate({ inputRange: [1, 2], outputRange: [0.4, 0] }) }]} />
              <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim2 }], opacity: pulseAnim2.interpolate({ inputRange: [1, 2], outputRange: [0.4, 0] }) }]} />
              <View style={styles.sensorCircle}>
                <Text style={styles.sensorIcon}>📶</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.readyText}>Pronto para validar</Text>
          </View>
        )}

        {status === 'validating' && (
          <View style={styles.centerBox}>
            <Animated.View style={{ transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
              <Text style={{ fontSize: 80 }}>⏳</Text>
            </Animated.View>
            <Text style={styles.statusTitle}>Validando...</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.centerBox}>
            <View style={styles.successIcon}>
              <Text style={{ fontSize: 50 }}>✅</Text>
            </View>
            <Text style={styles.statusTitle}>Passagem Liberada!</Text>
            <Text style={styles.priceDeduction}>- R$ 4,40</Text>
            <Text style={styles.successSub}>Boa viagem! 🚇</Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.centerBox}>
            <View style={styles.errorIcon}>
              <Text style={{ fontSize: 50 }}>❌</Text>
            </View>
            <Text style={styles.statusTitle}>Erro na Validação</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => setStatus('ready')}>
              <Text style={styles.retryText}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Skyline Decorativo */}
      <View style={styles.skyline}>
        <View style={styles.roadLine} />
        <Text style={styles.marquee}>🚇 METRÔ LINHA VERDE -------- 🚌 ÔNIBUS 107T-10</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1317' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 40, height: 90 },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  backIcon: { fontSize: 32, color: '#F2F4F7' },
  headerTitle: { color: '#F2F4F7', fontSize: 16, fontWeight: 'bold' },
  statusPill: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(0,184,124,0.05)' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerBox: { alignItems: 'center', width: '100%' },
  instruction: { color: '#F2F4F7', fontSize: 20, marginBottom: 30, fontWeight: '500' },
  floatingCard: { width: 240, height: 140, backgroundColor: '#1A2227', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#2D373D', elevation: 10, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: { width: 35, height: 25, backgroundColor: '#299c77', borderRadius: 4 },
  contactless: { fontSize: 18, color: '#00b87c' },
  cardLogo: { width: '100%', height: 40, opacity: 0.3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardNumber: { color: '#7fa89e', fontSize: 10, fontFamily: 'monospace' },
  cardBrand: { color: '#00b87c', fontSize: 10, fontWeight: 'bold' },
  sensorContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  pulseRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: '#00b87c' },
  sensorCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1A2227', borderWidth: 4, borderColor: '#00b87c', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  sensorIcon: { fontSize: 40, color: '#00b87c' },
  readyText: { color: '#00b87c', fontSize: 18, fontWeight: 'bold', marginTop: 30 },
  statusTitle: { color: '#F2F4F7', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  priceDeduction: { color: '#00b87c', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  successSub: { color: '#7fa89e', marginTop: 10 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,184,124,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#00b87c' },
  errorIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,0,0,0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ff4444' },
  errorText: { color: '#7fa89e', textAlign: 'center', paddingHorizontal: 40, marginTop: 10 },
  retryBtn: { marginTop: 30, backgroundColor: '#00b87c', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 30 },
  retryText: { color: '#0D1317', fontWeight: 'bold' },
  skyline: { height: 100, width: '100%', justifyContent: 'flex-end', paddingBottom: 20 },
  roadLine: { height: 2, backgroundColor: '#2D373D', width: '100%', marginBottom: 10 },
  marquee: { color: '#00b87c', opacity: 0.4, fontSize: 10, textAlign: 'center', letterSpacing: 2 },
});

export default NfcValidator;
