import axios from 'axios';
import url from 'url';

export const getData = feedUrl => axios.get(feedUrl).then(({ data }) => data);

export const getCategorisedData = catFeedUrl =>
  getData(catFeedUrl)
    .then(({ response: [{ components: [{ elements }, { feedUrl }] }] }) => {
      const { host, pathname, protocol, query } = url.parse(feedUrl, true);

      return elements.map(({ displayName, param: { topic } }) => ({
        title: displayName,
        url: url.format({
          protocol,
          host,
          pathname,
          query: { ...query, topic }
        })
      }));
    })
    .then(categories =>
      Promise.all(
        categories.map(({ title, url: catUrl }) =>
          getData(catUrl).then(({ response }) => ({ title, data: response }))
        )
      )
    );

export default { getData, getCategorisedData };
