import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

export const responsiveMargin = withGutter => {
  const result = withGutter
    ? { marginLeft: 16, marginRight: 16 }
    : { marginLeft: 0, marginRight: 0 };

  if (deviceWidth >= 768) {
    result.marginLeft = 114;
    result.marginRight = 114;
  }

  return result;
};

export const isCompact = () => deviceWidth <= 320;
export const isTablet = () => deviceWidth >= 720;
