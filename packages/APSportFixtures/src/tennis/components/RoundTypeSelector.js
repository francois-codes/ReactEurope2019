import React from 'react';
import PropTypes from 'prop-types';

import RoundTabs from './RoundTabs';
import RoundList from './RoundList';

const RoundTypeSelector = ({ pluginConfig, rounds, isFullScreen, isList }) => {
  const tapThreshold = pluginConfig && parseInt(pluginConfig.tap_threshold, 10);

  return isList ? (
    <RoundList {...{ competitions: rounds, tapThreshold }} />
  ) : (
    <RoundTabs
      {...{ isFullScreen, rounds, tapThreshold }}
      lastIndexFocus
      list={isList}
    />
  );
};

RoundTypeSelector.propTypes = {
  pluginConfig: PropTypes.object,
  rounds: PropTypes.array,
  isFullScreen: PropTypes.bool,
  isList: PropTypes.bool
};

export default RoundTypeSelector;
