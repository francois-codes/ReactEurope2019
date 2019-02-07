import {
  getFilterPair,
  getFilterOptions,
  pluckFromCentre,
  groupData,
  selectCurrentMonth,
  orderByDate,
  deepDropRepeats
} from '../../helpers/filter';

const RealDate = Date;
const mockDate = isoDate => {
  global.Date = class extends RealDate {
    constructor() {
      super();
      return new RealDate(isoDate);
    }
  };
};

describe('Filter helper', () => {
  afterEach(() => {
    global.Date = RealDate;
  });
  const formattedDate = {
    dateStr: '15.03.2018',
    id: 'märz-2018',
    label: 'März 2018'
  };
  const fromattedString = {
    label: 'Gameweek 20',
    id: 'gameweek-20'
  };
  describe('getFilterPair', () => {
    it('Recieves a date string and returns an object with new date string', () => {
      expect(getFilterPair('15.03.2018', '', 'date')).toEqual(formattedDate);
    });

    it('Recieves a string and returns an object with new string', () => {
      expect(getFilterPair('20', 'Gameweek ', 'string')).toEqual(
        fromattedString
      );
    });
  });

  describe('selectCurrentMonth', () => {
    it('Recieves an array of objects containing dates and returns an object with the current dates index', () => {
      const filterOption = [
        { label: 'März 2018', id: '' },
        { label: 'Apr. 2018', id: '' },
        { label: 'Mai 2018', id: '' }
      ];
      mockDate('2018-04-25T12:34:56z');
      expect(selectCurrentMonth(filterOption)).toEqual({
        index: 1,
        option: ''
      });
    });
  });

  describe('getFilterOptions', () => {
    const output = {
      label: 'May 2018',
      id: 'may-2018',
      url: 'url'
    };
    it('Returns an array of formatted dates', () => {
      const match = [
        {
          displayName: 'May 2018',
          feedUrl: 'url'
        }
      ];
      const expectedOutput = [output];
      expect(getFilterOptions(match)).toEqual(expectedOutput);
    });
  });

  describe('pluckFromCentre', () => {
    it('Returns a subset of an array, from its centre - even set, even limit', () => {
      const dataSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const limit = 4;
      const expectedOutput = [4, 5, 6, 7];
      expect(pluckFromCentre(dataSet, limit)).toEqual(expectedOutput);
    });

    it('Returns a subset of an array, from its centre - odd set, even limit', () => {
      const dataSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const limit = 4;
      const expectedOutput = [5, 6, 7, 8];

      expect(pluckFromCentre(dataSet, limit)).toEqual(expectedOutput);
    });

    it('Returns a subset of an array, from its centre - odd set, odd limit', () => {
      const dataSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const limit = 5;
      const expectedOutput = [4, 5, 6, 7, 8];

      expect(pluckFromCentre(dataSet, limit)).toEqual(expectedOutput);
    });

    it('Returns a subset of an array, from its centre - even set, odd limit', () => {
      const dataSet = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const limit = 5;
      const expectedOutput = [4, 5, 6, 7, 8];

      expect(pluckFromCentre(dataSet, limit)).toEqual(expectedOutput);
    });
  });

  describe('groupData', () => {
    const dataSet = [
      {
        match_date: '15.03.2018',
        matchday: 1
      },
      {
        match_date: '15.03.2018',
        matchday: 1
      },
      {
        match_date: '15.05.2018',
        matchday: 2
      },
      {
        match_date: '15.05.2018',
        matchday: 2
      },
      {
        match_date: '15.05.2018',
        matchday: 2
      }
    ];

    it('Returns grouped data', () => {
      const groupConfig = {
        property: ['match_date'],
        type: 'date',
        prefix: ''
      };

      const res = groupData(dataSet, false, groupConfig);
      expect(res.length).toBe(2);
      expect(res[0].groupTitle).toBe('März 2018');
      expect(res[1].groupTitle).toBe('Mai 2018');
      expect(res[0].match.length).toBe(2);
      expect(res[1].match.length).toBe(3);
    });

    it('Gets groupings for home live context', () => {
      const groupConfig = {
        property: ['matchday'],
        type: 'string',
        prefix: 'Gameweek '
      };

      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Gameweek 1');
    });

    it('Gets groupings for team screen context', () => {
      const groupConfig = {
        property: ['match_date'],
        type: 'full-date',
        prefix: ''
      };

      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Do. 15. März 2018');
    });

    it('Gets groupings for competition screen - Champions League', () => {
      const groupConfig = {
        property: ['matchday'],
        type: 'string',
        prefix: 'Gameweek '
      };

      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Gameweek 1');
    });

    it('Gets groupings for competition screen - Bundesliga', () => {
      const groupConfig = {
        property: ['matchday'],
        type: 'string',
        prefix: 'Gameweek '
      };
      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Gameweek 1');
    });

    it('Gets groupings for competition screen - Dfb Pokal', () => {
      const groupConfig = {
        property: ['matchday'],
        type: 'string',
        prefix: 'Round '
      };
      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Round 1');
    });

    it('Gets groupings for competition screen - Nfl', () => {
      const groupConfig = {
        property: ['match_date'],
        type: 'full-date',
        prefix: ''
      };
      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Do. 15. März 2018');
    });

    it('Gets groupings for live screen', () => {
      const groupConfig = {
        property: ['matchday'],
        type: 'string',
        prefix: 'Gameweek '
      };
      const res = groupData(dataSet, false, groupConfig);
      expect(res[0].groupTitle).toBe('Gameweek 1');
    });
  });

  describe('orderByDate', () => {
    it('Returns an array of dates in chronological order', () => {
      const dates = [
        { dateStr: '10.03.2018' },
        { dateStr: '10.06.2018' },
        { dateStr: '15.06.2018' },
        { dateStr: '12.06.2018' },
        { dateStr: '10.02.2018' }
      ];

      const expected = [
        { dateStr: '10.02.2018' },
        { dateStr: '10.03.2018' },
        { dateStr: '10.06.2018' },
        { dateStr: '12.06.2018' },
        { dateStr: '15.06.2018' }
      ];

      expect(orderByDate(dates)).toEqual(expected);
    });
  });

  describe('deepDropRepeats', () => {
    it('Returns an array with unique elements', () => {
      const data = [
        { id: 'May 2018' },
        { id: 'Mar 2018' },
        { id: 'Jan 2018' },
        { id: 'Jan 2018' },
        { id: 'Mar 2018' },
        { id: 'Mar 2018' },
        { id: 'May 2018' }
      ];
      const expected = [
        { id: 'May 2018' },
        { id: 'Mar 2018' },
        { id: 'Jan 2018' }
      ];
      expect(deepDropRepeats(data)).toEqual(expected);
    });
  });
});
