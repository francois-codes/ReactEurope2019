import moment from 'moment';
import 'moment/locale/de';
import {
  is,
  path,
  compose,
  splitAt,
  last,
  nth,
  prop,
  append,
  sort,
  length,
  dec,
  find,
  propEq,
  findIndex
} from 'ramda';

export const selectCurrentMonth = options => {
  // select current month
  const currentDate = moment().format('MMM YYYY');
  let hasSelected = false;
  const selectedIndex = options.reduce((selected, item, index) => {
    if (currentDate === item.label) {
      hasSelected = true;
      return index;
    }
    return hasSelected ? selected : index;
  }, 0);

  return { index: selectedIndex, option: path([selectedIndex, 'id'], options) };
};

const keyify = str => str.replace(/ /g, '-').toLowerCase();

export const selectLastOption = options => {
  const option = compose(
    keyify,
    prop('displayName'),
    last
  )(options);
  const index = compose(
    dec,
    length
  )(options);
  return { index, option };
};

export const selectCurrentOption = options => {
  const index = findIndex(propEq('current', '1'))(options);
  if (index < 0) {
    return selectLastOption(options);
  }
  const option = compose(
    keyify,
    prop('displayName'),
    nth(index)
  )(options);
  return { index, option };
};

export const getFeedUrl = (filterOptions, selectedOption) =>
  compose(
    prop('url'),
    find(propEq('id', selectedOption))
  )(filterOptions);

const getFormattedDate = dateStr => {
  const label = moment(dateStr, 'DD.MM.YYYY', 'de').format('MMM YYYY');
  const id = keyify(label);
  return { label, id, dateStr };
};

const getFormattedDateWithDay = dateStr => {
  const label = moment(dateStr, 'DD.MM.YYYY', 'de').format('ddd D. MMM YYYY');
  const id = keyify(label);
  return { label, id };
};

const getFormattedString = (str, prefix) => {
  const label = `${prefix}${str}`;
  const id = keyify(label);
  return { label, id };
};

export const pluckFromCentre = (dataSet, limit) => {
  const dataLength = dataSet.length;
  const diff = dataLength - limit;
  if (diff < 1) return dataSet;

  const segment = Math.ceil(diff / 2);

  const doubleSplit = compose(
    nth(0),
    splitAt(limit),
    last,
    splitAt(segment)
  );
  return doubleSplit(dataSet);
};

export const getNumberOfDaysFromToday = dateStr => {
  const targetDate = moment(dateStr, 'DD.MM.YYYY');
  return moment().diff(targetDate, 'days');
};

const getFormattedDayRelativeToToday = dateStr => {
  const targetDate = moment(dateStr, 'DD.MM.YYYY');
  const numberOfDays = moment().diff(targetDate, 'days');
  const numberOfMinutes = moment().diff(targetDate, 'minutes');
  if (numberOfDays === 1) {
    return { id: 'yesterday', label: 'Gestern' };
  } else if (numberOfDays === 0 && numberOfMinutes >= 0) {
    return { id: 'today', label: 'Heute' };
  } else if (numberOfDays === 0 && numberOfMinutes < 0) {
    return { id: 'tomorrow', label: 'Morgen' };
  }
  const label = moment(dateStr, 'DD.MM.YYYY', 'de').format('dddd');
  const id = keyify(label);
  return { id, label };
};

export const getFilterPair = (value, prefix, type) => {
  switch (type) {
    case 'day':
      return getFormattedDayRelativeToToday(value);
    case 'date':
      return getFormattedDate(value);
    case 'full-date':
      return getFormattedDateWithDay(value);
    default:
      return getFormattedString(value, prefix);
  }
};

export const deepDropRepeats = data => {
  const keys = {};
  return data.reduce((arr, item) => {
    const { id } = item;
    if (!prop(id, keys)) {
      keys[id] = 1;
      return append(item, arr);
    }
    return arr;
  }, []);
};

export const orderByDate = data => {
  const diff = (a, b) =>
    moment(a.dateStr, 'DD.MM.YYYY').unix() -
    moment(b.dateStr, 'DD.MM.YYYY').unix();

  return sort(diff, data);
};

export const getFilterOptions = dataSet => {
  if (is(Array, dataSet) === false) return [];
  return dataSet.map(({ displayName, feedUrl }) => ({
    label: displayName,
    id: keyify(displayName),
    url: feedUrl
  }));
};

export const groupData = (dataSet, filterBy, groupBy, values = []) => {
  const groups = {};
  return dataSet.reduce((data, item) => {
    const filterValue = filterBy && path(filterBy.property, item);

    const { id: filterId } =
      filterBy && getFilterPair(filterValue, filterBy.prefix, filterBy.type);

    const groupProp = is(Function, groupBy.property)
      ? groupBy.property(item)
      : groupBy.property;
    const groupValue = path(groupProp, item);
    const { id, label } = getFilterPair(
      groupValue,
      groupBy.prefix,
      groupBy.type
    );

    const groupKey = path([id], groups);
    if (groupKey !== undefined) {
      data[groupKey].match.push(item);
    } else {
      groups[id] = length(data);
      data.push({
        id: filterId,
        match: [item],
        values: values.map(val => path(val, item)),
        groupTitle: label
      });
    }

    return data;
  }, []);
};
