import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const INITIAL_COUNTER_VALUE = 0;

export default class GreenApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: this.props.initialCounterValue || INITIAL_COUNTER_VALUE,
      intervalId: 0,
      currentCount: 0
    };

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }

  updateCounterState(value) {
    this.setState(previousState => ({
      counter: previousState.counter + value
    }));
  }

  increment(value = 1) {
    this.updateCounterState(value);
  }

  decrement(value = 1) {
    this.updateCounterState(-value);
  }

  reset() {
    this.setState({
      counter: this.props.initialCounterValue || INITIAL_COUNTER_VALUE
    });
  }

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
        <Text styles={styles.text}>counter value: {this.state.counter}</Text>
        <View style={styles.buttonContainer}>
          {["increment", "decrement", "reset"].map((action, key) => (
            <Button onPress={() => this[action](1)} title={action} key={key} />
          ))}
        </View>
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
  buttonContainer: {
    justifyContent: "center"
  },
  button: {
    margin: 6
  },
  text: {
    margin: 12,
    color: "white"
  }
});
