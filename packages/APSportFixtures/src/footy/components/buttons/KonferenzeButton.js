import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image
} from 'react-native';

import assets from '../../assets/map.json';

const styles = StyleSheet.create({
  container: { justifyContent: 'center', alignItems: 'center' },
  button: {
    backgroundColor: '#e61624',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    // fontFamily: 'SFUIText',
    fontSize: 13,
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#ffffff'
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: { width: 15, height: 22, marginRight: 9 }
});

const KonferenzeButton = ({ handlePress }) => (
  <View style={styles.container}>
    <TouchableHighlight
      style={styles.button}
      onPress={handlePress}
      underlayColor="#e61624"
    >
      <View style={styles.buttonInner}>
        <Image source={assets.konferenzeIcon} style={styles.image} />
        <Text style={styles.buttonText}>KONFERENZE</Text>
      </View>
    </TouchableHighlight>
  </View>
);

KonferenzeButton.propTypes = { handlePress: PropTypes.func };

export default KonferenzeButton;
