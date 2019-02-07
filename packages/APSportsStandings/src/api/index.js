import axios from 'axios';

const fetchRequest = url =>
  axios.get(url, { timeout: 30000 }).then(response => response.data);

export default url => fetchRequest(url);
