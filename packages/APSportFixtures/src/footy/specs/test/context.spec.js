import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { compose } from 'ramda';
import { NativeModules } from 'react-native'; // eslint-disable-line

import configureStore from 'redux-mock-store';
import getContextView from '../../components/context';
import HomeLive from '../../components/context/fussball/homeLive';

import HomeLatestHybrid from '../../components/context/fussball/homeLatest/hybrid';
import HomeLatestKnockout from '../../components/context/fussball/homeLatest/knockout';
import HomeLatestStraight from '../../components/context/fussball/homeLatest/straight';

import TeamScreen from '../../components/context/fussball/teamScreen';

import CompetitionHybrid from '../../components/context/fussball/competitionScreen/hybrid';
import CompetitionKnockout from '../../components/context/fussball/competitionScreen/knockout';
import CompetitionStraight from '../../components/context/fussball/competitionScreen/straight';

import SportLive from '../../components/context/fussball/sportLive';

enzyme.configure({ adapter: new Adapter() });

jest.mock('NativeModules', () => ({
  PushNotifications: {
    getRegisteredTags: jest.fn()
  }
}));

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {
  filter: {
    primarySelectedOption: '',
    secondarySelectedOption: ''
  }
};

const render = compose(JSON.stringify, shallow);

describe('Context', () => {
  describe('homeLatest', () => {
    it('Returns competition screen context for Champions League', () => {
      const View = getContextView('fussball', 'homeLatest', 'champions-league');
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<HomeLatestHybrid />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });
    it('Returns competition screen context for Bundesliga', () => {
      const View = getContextView('fussball', 'homeLatest', 'bundesliga');
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<HomeLatestStraight />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });
    it('Returns competition screen context for Dfb Pokal', () => {
      const View = getContextView('fussball', 'homeLatest', 'dfb-pokal');
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<HomeLatestKnockout />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });
  });

  describe('homeLive', () => {
    it('Returns home live context', () => {
      const View = getContextView('fussball', 'homeLive', '');
      const viewTree = render(<View data={[]} />);
      const CompetitionHybridTree = render(<HomeLive data={[]} />);

      expect(CompetitionHybridTree).toBe(viewTree);
    });
  });

  describe('competitionScreen', () => {
    it('Returns competition screen context for Champions League', () => {
      const View = getContextView(
        'fussball',
        'competitionScreen',
        'champions-league'
      );
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<CompetitionHybrid />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });

    it('Returns competition screen context for Bundesliga', () => {
      const View = getContextView(
        'fussball',
        'competitionScreen',
        'bundesliga'
      );
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<CompetitionStraight />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });

    it('Returns competition screen context for Dfb Pokal', () => {
      const View = getContextView('fussball', 'competitionScreen', 'dfb-pokal');
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<CompetitionKnockout />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });
  });

  describe('sportLive', () => {
    it('Returns live screen context', () => {
      const View = getContextView('fussball', 'sportLive', '');
      const viewTree = render(<View data={[]} />);
      const CompetitionHybridTree = render(<SportLive data={[]} />);

      expect(CompetitionHybridTree).toBe(viewTree);
    });
  });

  describe('teamScreen', () => {
    it('Returns team screen context', () => {
      const View = getContextView('fussball', 'teamScreen', '');
      const viewTree = render(<View />, {
        context: { store: mockStore(initialState) }
      });

      const CompetitionHybridTree = render(<TeamScreen />, {
        context: { store: mockStore(initialState) }
      });

      expect(CompetitionHybridTree).toBe(viewTree);
    });
  });
});
