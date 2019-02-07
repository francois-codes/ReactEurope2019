import { curry, compose, props, is, unless } from 'ramda';
import URL from 'url';

export const getUrlQuery = url => URL.parse(url, true).query;

export const getParams = curry((params, url) => {
  const paramsList = unless(is(Array), x => [x], params);

  return compose(props(paramsList), getUrlQuery)(url);
});
