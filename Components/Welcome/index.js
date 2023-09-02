import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

const Welcome = () => {
  return (
    <View style={styles.mainView}>
      <Text>Welcome to Alrammm</Text>
      <Text>your only app to manage all your events world wide</Text>
      <Button title="Go" />
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default Welcome;
