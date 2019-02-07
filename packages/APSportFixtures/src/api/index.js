import axios from 'axios';

const fetchRequest = url =>
  axios
    .get(url, { timeout: 30000, headers: { 'Cache-Control': 'no-cache' } })
    .then(response => response.data)
    .catch(console.warn); // eslint-disable-line no-console

export default fetchRequest;
