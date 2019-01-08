import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default class ModalApp extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>I'm a modal app</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white"
  }
});
