import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import GroupList from './GroupList';
import Header from '../../common/components/Header';
import Empty from '../../tennis/components/Empty';

const Categories = ({ data, singleDay, alwaysShowCategoryTitle }) => (
  <View>
    {data && data.length ? (
      data.map(({ sportname, rounds }) => (
        <View key={sportname}>
          {data.length > 1 || alwaysShowCategoryTitle ? (
            <Header>{sportname.toUpperCase()}</Header>
          ) : null}
          <GroupList {...{ data: rounds, singleDay }} />
        </View>
      ))
    ) : (
      <Empty>Aktuell finden keine Live-Events statt.</Empty>
    )}
  </View>
);

Categories.propTypes = {
  data: PropTypes.array.isRequired,
  singleDay: PropTypes.bool,
  alwaysShowCategoryTitle: PropTypes.bool
};

Categories.defaultProps = {
  alwaysShowCategoryTitle: false
};

export default Categories;
