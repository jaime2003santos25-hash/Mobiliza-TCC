import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NFCReaderScreen: React.FC = () => {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startPulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startPulse();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC - Validar</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>Aproxime-se da catraca</Text>

        {/* Animação de Pulso NFC */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.5],
                  outputRange: [0.5, 0],
                }),
              },
            ]}
          />
          <View style={styles.mainCircle}>
            <Text style={styles.nfcMainIcon}>📶</Text>
          </View>
        </View>

        <Text style={styles.statusTitle}>Pronto para validar</Text>
        <Text style={styles.statusSubtitle}>
          Aproxime o celular da catraca para liberar a passagem.
        </Text>
      </View>

      {/* Ilustração decorativa no rodapé similar ao print */}
      <View style={styles.footerIllustration}>
        <Text style={styles.busEmoji}>🚌 🚐 🚍</Text>
        <View style={styles.cityLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1317',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    height: 90,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { fontSize: 32, color: '#F2F4F7' },
  headerTitle: { color: '#F2F4F7', fontSize: 16, fontWeight: 'bold' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  instruction: {
    color: '#F2F4F7',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 60,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: '#0DB39E',
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(13, 179, 158, 0.1)',
    borderWidth: 2,
    borderColor: '#0DB39E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#0DB39E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  nfcMainIcon: { fontSize: 60 },
  statusTitle: {
    color: '#F2F4F7',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusSubtitle: {
    color: '#7fa89e',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 60,
    lineHeight: 22,
  },
  footerIllustration: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 40,
  },
  busEmoji: { fontSize: 30, opacity: 0.3 },
  cityLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#2D373D',
    marginTop: 10,
  },
});

export default NFCReaderScreen;
