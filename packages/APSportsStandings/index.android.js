import { AppRegistry } from 'react-native';
import { withZapp } from 'react-native-zapp-bridge';

import App from './src/App';

const AppWithZapp = withZapp(App);

// Module name
AppRegistry.registerComponent('RNRoot', () => AppWithZapp);
