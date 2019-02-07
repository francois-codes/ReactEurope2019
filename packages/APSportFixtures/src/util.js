import 'moment/locale/de';
import 'moment-timezone';
import moment from 'moment';
import R from 'ramda';
import { SERVER_TIMEZONE } from './const';
import getEventsData from './api';

export const momentFormat = R.invoker(1, 'format');
export const convertToDeviceTimezone = R.invoker(1, 'tz')(moment.tz.guess());
export const parseDate = (date, time) =>
  moment.tz(`${date} ${time}`, 'DD.MM.YYYY HH:mm', SERVER_TIMEZONE);
export const convertToLocalTime = R.compose(
  momentFormat('HH:mm'),
  convertToDeviceTimezone,
  time => moment.tz(time, ' HH:mm', 'Europe/Berlin')
);

// it accepts an game object as an argument
export const isGameLive = ({ match_date, match_time, finished }) => {
  const gameTime = parseDate(match_date, match_time);
  const now = moment();
  const hasStarted = gameTime.isBefore(now);
  const isFinished = finished !== 'no';

  return hasStarted && !isFinished;
};

export const getMatchMinute = async game => {
  const { feedUrl } = game;
  const {
    response: [{ match: { current_minute } = {} } = {}] = []
  } = await getEventsData(feedUrl);
  return { ...game, current_minute };
};
