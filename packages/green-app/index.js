import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class GreenApp extends React.Component {
  stringifiedProps = () => {
    return JSON.stringify(this.props);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>I'm the green App :o</Text>
        <Text style={styles.text}>
          I received these props from the native side {this.stringifiedProps()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white"
  }
});
