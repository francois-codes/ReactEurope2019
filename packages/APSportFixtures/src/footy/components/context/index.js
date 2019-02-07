import { replace, toUpper, path, contains } from 'ramda';
import HomeLive from './fussball/homeLive';

import HomeLatestHybrid from './fussball/homeLatest/hybrid';
import HomeLatestKnockout from './fussball/homeLatest/knockout';
import HomeLatestStraight from './fussball/homeLatest/straight';

import TeamScreen from './fussball/teamScreen';

import CompetitionHybrid from './fussball/competitionScreen/hybrid';
import CompetitionKnockout from './fussball/competitionScreen/knockout';
import CompetitionStraight from './fussball/competitionScreen/straight';

import SportLive from './fussball/sportLive';

import HomeLiveNFL from './nfl/homeLive';
import TeamScreenNFL from './nfl/teamScreen';
import SportLiveNFL from './nfl/sportLive';
import CompetitionScreenNFL from './nfl/competitionScreen';

import HomeLatestNFLRegular from './nfl/homeLatest/regular';

const map = {
  fussball: {
    HomeLive,
    HomeLatest: {
      hybrid: HomeLatestHybrid,
      knockout: HomeLatestKnockout,
      straight: HomeLatestStraight
    },
    TeamScreen,
    CompetitionScreen: {
      hybrid: CompetitionHybrid,
      knockout: CompetitionKnockout,
      straight: CompetitionStraight
    },
    SportLive
  },
  'us-sport': {
    HomeLive: HomeLiveNFL,
    HomeLatest: { regular: HomeLatestNFLRegular },
    TeamScreen: TeamScreenNFL,
    CompetitionScreen: { regular: CompetitionScreenNFL },
    SportLive: SportLiveNFL
  }
};

const getCompetitonType = (sport, context, competition) => {
  const straight = [
    'bundesliga',
    'zweite-liga',
    'dritte-liga',
    'england',
    'spanien',
    'italien',
    'frankreich'
  ];

  const knockout = ['dfb-pokal'];
  if (sport === 'us-sport') {
    return 'regular';
  }
  if (contains(competition, straight)) {
    return 'straight';
  }
  if (contains(competition, knockout)) {
    return 'knockout';
  }
  return 'hybrid';
};

export default (sport, context, competition) => {
  if (!path([sport], map)) throw new Error('Invalid sport');

  const classContext = replace(/^./, toUpper)(context);
  if (!path([sport, classContext], map)) throw new Error('Invalid context');

  if (context === 'homeLatest' || context === 'competitionScreen') {
    const competitonType = getCompetitonType(sport, context, competition);
    return map[sport][classContext][competitonType];
  }
  return map[sport][classContext];
};

// Expected contexts:
/*
homeLive
homeLatest
teamScreen
competitionScreen
sportLive
*/
