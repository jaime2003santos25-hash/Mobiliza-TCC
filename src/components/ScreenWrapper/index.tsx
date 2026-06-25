import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { Theme } from '../../styles/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  backgroundColor = Theme.dark.bgPrimary
}) => {
  const [time, setTime] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.outerContainer, { backgroundColor }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Top Header Placeholder (Apple style status bar overlay) */}
      <View style={styles.statusBarOverlay}>
        <Text style={styles.timeText}>{time}</Text>
        <View style={styles.statusIcons}>
          <Text style={styles.iconText}>📶</Text>
          <Text style={styles.iconText}>📶</Text>
          <Text style={[styles.iconText, { fontSize: 16 }]}>🔋</Text>
        </View>
      </View>

      <View style={styles.content}>
        {children}
      </View>

      {/* Home Indicator (Luxo) */}
      <View style={styles.homeIndicatorContainer}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  statusBarOverlay: {
    width: '100%',
    height: Platform.OS === 'ios' ? 44 : 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconText: {
    color: '#FFF',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  homeIndicatorContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
  },
});

export default ScreenWrapper;
