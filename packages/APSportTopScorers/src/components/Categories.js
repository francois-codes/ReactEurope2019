import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import List from './List';
import { responsiveMargin } from '../helpers/responsive';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
    borderRadius: 4,
    height: 29,
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  tab: {
    flex: 1,
    height: '100%',
    backgroundColor: '#f6f6f8',
    borderWidth: 1,
    borderColor: '#1f5ae6'
  },
  leftEnd: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
    borderRightWidth: 0
  },
  rightEnd: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    borderLeftWidth: 0
  },
  tabText: {
    fontSize: 13,
    letterSpacing: -0.08,
    textAlign: 'center',
    color: '#1f5ae6',
    lineHeight: 27,
    backgroundColor: 'transparent'
  },
  selectedTab: { backgroundColor: '#1f5ae6' },
  selectedTabText: { color: '#ffffff' }
});

class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedIndex: 0 };
  }

  handlePress(selectedIndex) {
    this.setState({ selectedIndex });
  }

  render() {
    const { data, sport } = this.props;
    const { selectedIndex } = this.state;

    return (
      <View>
        <View style={[styles.container, responsiveMargin(true)]}>
          {data.map(({ title }, index) => (
            <TouchableOpacity
              key={title}
              style={[
                styles.tab,
                index === 0 ? styles.leftEnd : null,
                index === data.length - 1 ? styles.rightEnd : null,
                index === selectedIndex ? styles.selectedTab : null
              ]}
              onPress={() => this.handlePress(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  index === selectedIndex ? styles.selectedTabText : null
                ]}
              >
                {title.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <List data={data[selectedIndex].data} {...{ sport }} />
      </View>
    );
  }
}

Categories.propTypes = { data: PropTypes.array, sport: PropTypes.string };

export default Categories;
