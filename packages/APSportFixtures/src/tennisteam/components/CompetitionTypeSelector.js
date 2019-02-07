import React from 'react';
import PropTypes from 'prop-types';

import RoundTabs from './RoundTabs';
import EraGroupedCompList from './EraGroupedCompList';

const CompetitionTypeSelector = ({ rounds, eras }) => {
  if (rounds) {
    return <RoundTabs rounds={rounds} lastIndexFocus />;
  }

  if (eras) {
    return <EraGroupedCompList eras={eras} />;
  }

  return null;
};

CompetitionTypeSelector.propTypes = {
  rounds: PropTypes.array,
  eras: PropTypes.array
};

export default CompetitionTypeSelector;
