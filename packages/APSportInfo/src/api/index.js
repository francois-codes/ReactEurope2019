/* eslint camelcase: 0 */
import axios from 'axios';
import { path } from 'ramda';

export const fetchResponse = u =>
  axios.get(u, { timeout: 30000 }).then(path(['data', 'response']));

export const fetchAllPlayerData = url =>
  fetchResponse(url).then(
    ({ tabs: [, { feedUrl: infoURL }, { feedUrl: statsURL }] }) =>
      Promise.all([fetchResponse(infoURL), fetchResponse(statsURL)])
        .then(([info, [{ components: [, { feedUrl }] }]]) => ({
          ...info,
          stats: feedUrl
        }))
        .then(({ stats, ...data }) =>
          fetchResponse(stats).then(
            ([
              { assists, playing, score, score_penalty, scorerpoints } = {}
            ]) => ({
              ...data,
              stats: { assists, playing, score, score_penalty, scorerpoints }
            })
          )
        )
  );

export default { fetchResponse, fetchAllPlayerData };
