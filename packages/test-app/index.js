import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

const INITIAL_COUNTER_VALUE = 0;

export default () => (
  <View style={{ backgroundColor: "green", width: 100, height: 100 }}>
    <Text>Hello I'm green</Text>
  </View>
);

/*
export default class GreenApp extends React.Component {
  constructor(props) {
    super(props); // can't call `this` before this

    // initialising component's state
    // if you want to override the default of 0, you can pass props from the native side with
    // (new Bundle()).putInt("initialCounterValue", XX);
    this.state = {
      counter: this.props.initialCounterValue || INITIAL_COUNTER_VALUE,
      intervalId: 0,
      currentCount: 0,
    };

    // react weirdness. Remember JS is not OP, it's prototype based. don't be fooled by the `class keyword`
    // the code below is to make sure the component methods are bound to the proper instance of the component
    // you only need to do this when you pass these methods as props to other components
    // (which we do in render to trigger the actions);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.reset = this.reset.bind(this);
  }

  // alternatively, you can initialize state as a class property like this :
  // state = { counter: 0 };

  // utility component method. since we don't pass it as props, no need to bind in constructor
  updateCounterState(value) {
    this.setState(previousState => ({
      counter: previousState.counter + value,
    }));
  }

  // component method with a default value if the arg is ommitted
  increment(value = 1) {
    this.updateCounterState(value);
  }

  decrement(value = -1) {
    this.updateCounterState(value);
  }

  reset() {
    this.updateCounterState(
      this.props.initialCounterValue || INITIAL_COUNTER_VALUE,
    );
  }

  stringifiedProps = () => {
    return JSON.stringify(this.props);
  };
  componentDidMount() {
    var intervalId = setInterval(this.updateTimerState, 1000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  updateTimerState = () => {
    this.setState(previousState => ({
      currentCount: previousState.currentCount + 1,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Text styles={styles.text}>
          counter value: {this.state.currentCount}
        </Text>
        <Text style={styles.text}>I'm the green App :o</Text>
        <Text style={styles.text}>
          I received these props from the native side {this.stringifiedProps()}
        </Text>
        <Text styles={styles.text}>counter value: {this.state.counter}</Text>
        <Button onPress={() => this.increment(2)} title="increment by 2" />
        <Button onPress={() => this.decrement(2)} title="decrement by 2" />
        {['increment', 'decrement', 'reset'].map((action, key) => (
          <Button onPress={() => this[action](1)} title={action} key={key} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});
*/
