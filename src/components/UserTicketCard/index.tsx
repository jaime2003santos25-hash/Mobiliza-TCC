import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
} from 'react-native';

interface UserTicketCardProps {
  userName: string;
  cardNumber: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;
const CARD_HEIGHT = 200;

const UserTicketCard: React.FC<UserTicketCardProps> = ({ userName, cardNumber }) => {
  const [flipped, setFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;

  // Para o efeito de "arrastar" (tilt)
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Rotaciona levemente baseado no movimento (tilt effect)
        rotateX.setValue(gestureState.dy / 10);
        rotateY.setValue(gestureState.dx / 10);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Se foi apenas um toque rápido (sem muito movimento), vira o cartão
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          flipCard();
        }

        // Volta o tilt ao normal
        Animated.spring(rotateX, { toValue: 0, useNativeDriver: true }).start();
        Animated.spring(rotateY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const flipCard = () => {
    if (flipped) {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  // Estilo de rotação combinada (Flip + Tilt)
  const frontAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: frontInterpolate },
      { rotateX: rotateX.interpolate({ inputRange: [-10, 10], outputRange: ['-15deg', '15deg'] }) },
      { rotateY: rotateY.interpolate({ inputRange: [-10, 10], outputRange: ['-15deg', '15deg'] }) },
    ],
    opacity: frontOpacity,
  };

  const backAnimatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: backInterpolate },
      { rotateX: rotateX.interpolate({ inputRange: [-10, 10], outputRange: ['-15deg', '15deg'] }) },
      { rotateY: rotateY.interpolate({ inputRange: [-10, 10], outputRange: ['-15deg', '15deg'] }) },
    ],
    opacity: backOpacity,
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Frente do Cartão */}
      <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
        <Image
          source={require('../../assets/images/logo_mobiliza.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.chipContainer}>
          <View style={styles.chip} />
        </View>
        <Text style={styles.cardType}>BILHETE ÚNICO</Text>
      </Animated.View>

      {/* Verso do Cartão */}
      <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
        <View style={styles.blackStrip} />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>NOME DO USUÁRIO</Text>
          <Text style={styles.value}>{userName.toUpperCase()}</Text>

          <View style={styles.row}>
            <View>
              <Text style={styles.label}>NÚMERO DO CARTÃO</Text>
              <Text style={styles.value}>{cardNumber}</Text>
            </View>
            <View style={styles.qrPlaceholder}>
              <View style={styles.barcodeLine} />
              <View style={[styles.barcodeLine, { width: '80%' }]} />
              <View style={[styles.barcodeLine, { width: '90%' }]} />
              <View style={[styles.barcodeLine, { width: '70%' }]} />
            </View>
          </View>
        </View>
        <Text style={styles.footerText}>MOBILIZA - TRANSPORTE PÚBLICO</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: 24,
    marginTop: 20,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20, // Mais arredondado para ficar moderno
    backfaceVisibility: 'hidden',
    position: 'absolute',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  frontCard: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#1d4a42',
  },
  backCard: {
    backgroundColor: '#0D1B1E',
    borderWidth: 1.5,
    borderColor: '#1d4a42',
    paddingTop: 20,
  },
  logo: {
    width: '90%',
    height: '70%',
  },
  chipContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  chip: {
    width: 45,
    height: 35,
    backgroundColor: '#3DAE91',
    borderRadius: 8,
    opacity: 0.6,
    borderWidth: 1,
    borderColor: '#F2F4F7',
  },
  cardType: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    color: '#3DAE91',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  blackStrip: {
    width: '100%',
    height: 45,
    backgroundColor: '#000',
    marginTop: 10,
  },
  infoContainer: {
    padding: 20,
  },
  label: {
    color: '#5DCAA5',
    fontSize: 11,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  value: {
    color: '#F2F4F7',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrPlaceholder: {
    width: 70,
    height: 50,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  barcodeLine: {
    height: 4,
    backgroundColor: '#000',
    marginBottom: 3,
    width: '100%',
  },
  footerText: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    textAlign: 'center',
    color: '#3DAE91',
    fontSize: 9,
    opacity: 0.7,
    fontWeight: '600',
  },
});

export default UserTicketCard;
