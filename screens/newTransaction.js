import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text>New Transaction Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});