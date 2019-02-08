import { AppRegistry } from 'react-native';
import { withZapp } from 'react-native-zapp-bridge';
import App from './src/App';

const ZappAppComponent = withZapp(App);

AppRegistry.registerComponent('RNRoot', () => ZappAppComponent);
