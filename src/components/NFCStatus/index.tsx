import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NFCStatus: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>NFC Status Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
});

export default NFCStatus;
