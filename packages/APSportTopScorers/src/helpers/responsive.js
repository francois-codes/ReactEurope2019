import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

export const responsiveMargin = () => ({
  marginHorizontal: deviceWidth >= 768 ? 114 : 0
});

export const isTablet = () => deviceWidth < 720;
