import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { navigation } from 'react-native-zapp-bridge';

import assets from '../assetsMap';

const styles = StyleSheet.create({
  navBtn: { position: 'relative', height: 44, width: 44 },
  closeImg: { width: 14, height: 14, position: 'absolute', left: 11, top: 15 }
});

const handleClose = () => {
  navigation.closeModalScreen();
};

const Close = () => (
  <TouchableOpacity onPress={handleClose} style={styles.navBtn}>
    <Image source={assets.close} style={styles.closeImg} />
  </TouchableOpacity>
);

export default Close;
