import React from 'react';
import PropTypes from 'prop-types';

import messages from '../helpers/messages';

import List from './List';
import Categories from './Categories';
import ErrorMessage from './ErrorMessage';

const ContentView = ({ listData, categorisedData, sport }) => {
  if (!(listData || categorisedData).length) {
    return <ErrorMessage>{messages.noContentYet}</ErrorMessage>;
  }

  return listData ? (
    <List data={listData} {...{ sport }} />
  ) : (
    <Categories data={categorisedData} {...{ sport }} />
  );
};

ContentView.propTypes = {
  listData: PropTypes.array,
  categorisedData: PropTypes.array,
  sport: PropTypes.string.isRequired
};

export default ContentView;
