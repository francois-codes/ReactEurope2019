import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { setSecondaryFilterOption as setSecondaryFilterOptionAction } from '../../actions';
import { responsiveMargin } from '../../helpers/responsive';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
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
    lineHeight: 13,
    paddingVertical: 7,
    backgroundColor: 'transparent'
  },
  selectedTab: { backgroundColor: '#1f5ae6' },
  selectedTabText: { color: '#ffffff' }
});

class SubTabs extends PureComponent {
  handlePress(event, secondarySelectedOption) {
    this.props.setSecondaryFilterOption({ secondarySelectedOption });
  }

  isSelected(tab, type) {
    const { selectedOption } = this.props;
    if (tab === selectedOption && type === 'text') {
      return styles.selectedTabText;
    } else if (tab === selectedOption) {
      return styles.selectedTab;
    }
    return {};
  }

  render() {
    const withGutter = true;
    const margins = responsiveMargin(withGutter);
    const tabId1 = 'all';
    const tabId2 = 'home';
    const tabId3 = 'away';
    return (
      <View style={[styles.container, margins]}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.tab, styles.leftEnd, this.isSelected(tabId1)]}
          onPress={event => this.handlePress(event, tabId1)}
        >
          <Text style={[styles.tabText, this.isSelected(tabId1, 'text')]}>
            ALLE
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.tab, this.isSelected(tabId2)]}
          onPress={event => this.handlePress(event, tabId2)}
        >
          <Text style={[styles.tabText, this.isSelected(tabId2, 'text')]}>
            HEIM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.tab, styles.rightEnd, this.isSelected(tabId3)]}
          onPress={event => this.handlePress(event, tabId3)}
        >
          <Text style={[styles.tabText, this.isSelected(tabId3, 'text')]}>
            AUSWÄRTS
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

SubTabs.propTypes = {
  setSecondaryFilterOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.string.isRequired
};

const mapStateToProps = ({ filter }) => ({
  selectedOption: filter.secondarySelectedOption
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { setSecondaryFilterOption: setSecondaryFilterOptionAction },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SubTabs);
