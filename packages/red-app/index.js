import React from 'react';
import { StyleSheet, View, Text, ART } from 'react-native';
import Circle from '../shared/circle';

export default class RedApp extends React.Component {
  stringifiedProps = () => {
    return JSON.stringify(this.props);
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>I'm the red App :o</Text>
        <Text style={styles.text}>
          \nI received these props from the native side{' '}
          {this.stringifiedProps()}
        </Text>
        <ART.Surface width={40} height={40}>
          <ART.Group x={0} y={0}>
            <Circle radius={20} fill={'#f06'} />
          </ART.Group>
        </ART.Surface>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});
