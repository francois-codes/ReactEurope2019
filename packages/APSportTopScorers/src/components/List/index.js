import React from 'react';
import PropTypes from 'prop-types';

import MotorSportList from './MotorSportList';
import FussballList from './FussballList';
import TennisList from './TennisList';

const List = ({ data, sport }) =>
  ({
    fussball: <FussballList {...{ data }} />,
    motorsport: <MotorSportList {...{ data }} />,
    tennis: <TennisList {...{ data }} />
  }[sport]);

List.propTypes = { data: PropTypes.array, sport: PropTypes.string };

export default List;
