import React, { PureComponent } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

const { width } = Dimensions.get('window');
const tabWidth = width / 3;

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    lineHeight: 18,
    marginVertical: 10,
    fontWeight: 'bold',
    opacity: 1,
    color: 'rgb(160, 170, 180)'
  },
  selectedLabel: { color: 'rgb(31, 90, 230)' },
  container: { width, height: 54, backgroundColor: 'white' },
  tab: {
    width: tabWidth,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center'
  },
  wrapper: { height: 54, flexDirection: 'row' }
});

class CustomTabBar extends PureComponent {
  constructor(props) {
    super(props);

    this.initialXOffset = this.props.index * tabWidth;

    this.handleTabPress = this.handleTabPress.bind(this);
  }
  handleTabPress(index) {
    this.ref.scrollTo({ x: tabWidth * index, y: 0, animated: true });
  }
  render() {
    const { routes, index } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          snapToInterval={tabWidth}
          contentOffset={{ x: this.initialXOffset, y: 0 }}
          horizontal
          ref={ref => {
            this.ref = ref;
          }}
        >
          <View
            style={[styles.wrapper, { width: tabWidth * (routes.length + 2) }]}
          >
            <View style={styles.tab} />
            {routes.map(({ title }, i) => (
              <TouchableOpacity
                key={title}
                onPress={() => {
                  this.handleTabPress(i);
                  this.props.onTabPress(i);
                }}
              >
                <View style={styles.tab}>
                  <Text
                    style={[
                      styles.label,
                      i === index ? styles.selectedLabel : null
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.tab} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

CustomTabBar.propTypes = {
  onTabPress: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired
};

export default CustomTabBar;
