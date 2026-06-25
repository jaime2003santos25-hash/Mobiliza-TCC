import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
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
const CARD_HEIGHT = 220;

const UserTicketCard: React.FC<UserTicketCardProps> = ({ userName, cardNumber }) => {
  // Valores para rotação contínua (360 graus)
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // dx e dy controlam a rotação.
        // Dividimos por um fator para a rotação ser suave.
        rotateY.setValue(gestureState.dx);
        rotateX.setValue(-gestureState.dy);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Volta suavemente para a posição inicial ao soltar
        Animated.parallel([
          Animated.spring(rotateY, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: true
          }),
          Animated.spring(rotateX, {
            toValue: 0,
            friction: 6,
            tension: 40,
            useNativeDriver: true
          }),
        ]).start();
      },
    })
  ).current;

  // Interpolação para transformar o movimento em rotação total
  const rotateYInterpolate = rotateY.interpolate({
    inputRange: [-CARD_WIDTH, CARD_WIDTH],
    outputRange: ['-180deg', '180deg'],
  });

  const rotateXInterpolate = rotateX.interpolate({
    inputRange: [-CARD_HEIGHT, CARD_HEIGHT],
    outputRange: ['-180deg', '180deg'],
  });

  // Mostra a frente ou o verso dependendo da rotação
  const frontOpacity = rotateY.interpolate({
    inputRange: [-CARD_WIDTH / 2, 0, CARD_WIDTH / 2],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = rotateY.interpolate({
    inputRange: [-CARD_WIDTH, -CARD_WIDTH / 2, 0, CARD_WIDTH / 2, CARD_WIDTH],
    outputRange: [1, 1, 0, 1, 1],
  });

  const animatedStyle = {
    transform: [
      { perspective: 1000 },
      { rotateY: rotateYInterpolate },
      { rotateX: rotateXInterpolate },
    ],
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>

        {/* Lado Frontal */}
        <Animated.View style={[styles.card, styles.frontCard, { opacity: frontOpacity }]}>
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

        {/* Lado Verso */}
        <Animated.View
          style={[
            styles.card,
            styles.backCard,
            {
              position: 'absolute',
              opacity: backOpacity,
              transform: [{ rotateY: '180deg' }] // O verso deve estar invertido inicialmente
            }
          ]}
        >
          <View style={styles.blackStrip} />
          <View style={styles.infoContainer}>
            <Text style={styles.label}>NOME DO USUÁRIO</Text>
            <Text style={styles.value}>{userName.toUpperCase() || 'JAYME'}</Text>

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>NÚMERO DO CARTÃO</Text>
                <Text style={styles.value}>{cardNumber || '4888 7291 7112 2366'}</Text>
              </View>
              <View style={styles.qrPlaceholder}>
                <View style={styles.barcodeLine} />
                <View style={[styles.barcodeLine, { width: '80%' }]} />
                <View style={[styles.barcodeLine, { width: '90%' }]} />
              </View>
            </View>
          </View>
          <Text style={styles.footerText}>MOBILIZA - TRANSPORTE PÚBLICO</Text>
        </Animated.View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginVertical: 20,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backfaceVisibility: 'hidden',
    backgroundColor: '#1A2227',
    borderWidth: 1.5,
    borderColor: '#2D373D',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  frontCard: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backCard: {
    backgroundColor: '#0D1B1E',
    paddingTop: 10,
  },
  logo: {
    width: '80%',
    height: '60%',
  },
  chipContainer: {
    position: 'absolute',
    top: 35,
    left: 25,
  },
  chip: {
    width: 45,
    height: 35,
    backgroundColor: '#3DAE91',
    borderRadius: 8,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
    marginTop: 20,
  },
  infoContainer: {
    padding: 24,
  },
  label: {
    color: '#5DCAA5',
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  value: {
    color: '#F2F4F7',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrPlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 4,
  },
  barcodeLine: {
    height: 3,
    backgroundColor: '#000',
    marginBottom: 2,
    width: '100%',
  },
  footerText: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    textAlign: 'center',
    color: '#3DAE91',
    fontSize: 8,
    opacity: 0.8,
    fontWeight: 'bold',
  },
});

export default UserTicketCard;
