import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NFCValidationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>NFC Validation Screen</Text>
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

export default NFCValidationScreen;
