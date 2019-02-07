import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

export const isCompact = () => deviceWidth <= 320;

export default { isCompact };
