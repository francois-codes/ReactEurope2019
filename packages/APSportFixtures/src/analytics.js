import { sendAnalyticEvent } from 'react-native-zapp-bridge';

export const sendOnLoadEvent = sport =>
  sendAnalyticEvent(`RN fullscreen ${sport}`)
    .then(console.log, console.warn)
    .catch(console.warn);
export default { sendOnLoadEvent };
