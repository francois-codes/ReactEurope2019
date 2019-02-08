import React from 'react';
import { View, SafeAreaView, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import Navigation from './Navigation';

const ContextAwareRootView = ({ isFullScreen, children, style }) => {
  const RootView = isFullScreen ? SafeAreaView : View;

  return (
    <RootView {...{ style }}>
      {isFullScreen && <Navigation />}
      {children}
    </RootView>
  );
};

ContextAwareRootView.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  style: ViewPropTypes.style
};

ContextAwareRootView.defaultProps = {
  isFullScreen: false
};

export default ContextAwareRootView;
