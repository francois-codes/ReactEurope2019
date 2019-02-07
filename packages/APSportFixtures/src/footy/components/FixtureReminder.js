import React, { PureComponent } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { toggleAlert as toggleAlertActin } from '../actions';
import assets from '../assets/map.json';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 6,
    paddingRight: 6,
    maxWidth: 36,
    height: '100%'
  },
  image: { width: 22, height: 22 }
});

class FixtureReminder extends PureComponent {
  handlePress() {
    const { toggleAlert, gameId } = this.props;
    toggleAlert(gameId);
  }
  render() {
    const { alerts, gameId } = this.props;
    const bell = alerts.includes(gameId) ? assets.bellActive : assets.bell;
    return (
      <TouchableOpacity onPress={() => this.handlePress()}>
        <View style={styles.container}>
          <Image style={styles.image} source={bell} />
        </View>
      </TouchableOpacity>
    );
  }
}

FixtureReminder.propTypes = {
  gameId: PropTypes.string,
  registerAlert: PropTypes.func,
  alerts: PropTypes.array,
  toggleAlert: PropTypes.func
};

const mapStateToProps = ({ alerts: { alerts } }) => ({ alerts });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ toggleAlert: toggleAlertActin }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FixtureReminder);
