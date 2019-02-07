import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Loader from './index';

it('Loader renders correctly', () => {
  const tree = renderer.create(<Loader color="green" />).toJSON();

  expect(tree).toMatchSnapshot();
});
