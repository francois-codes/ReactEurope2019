import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { length, is } from 'ramda';
import { Empty } from './index';

const AsyncContent = ({ children, data }) => {
  const emptyMessage =
    'Für diesen Bereich sind noch keine Informationen verfügbar. Bitte versuchen Sie es später noch einmal;';

  if (is(Array, data)) {
    return length(data) ? children : <Empty text={emptyMessage} />;
  }

  return <ActivityIndicator size="large" />;
};

AsyncContent.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default AsyncContent;
