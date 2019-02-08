import { sendAnalyticEvent } from 'react-native-zapp-bridge';

export const sendOnLoadEvent = sport =>
  sendAnalyticEvent(`RN fullscreen ${sport}`, { 'Screen View': true })
    .then(console.log, console.warn)
    .catch(console.warn);
export default { sendOnLoadEvent };
