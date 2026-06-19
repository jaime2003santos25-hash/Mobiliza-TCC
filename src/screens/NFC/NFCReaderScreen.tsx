import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NFCReaderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>NFC Reader Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NFCReaderScreen;
