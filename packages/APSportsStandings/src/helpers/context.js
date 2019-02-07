const getConfig = (appContext, sport, competition, leagueType) => {
  const defaultConfig = {
    hasPrimaryFilter: leagueType === 'group',
    hasSecondaryFilter: false
  };
  if (sport === 'us-sport') {
    return {
      hasPrimaryFilter: false,
      hasSecondaryFilter: false
    };
  } else if (competition === 'bundesliga') {
    return {
      hasPrimaryFilter: true,
      hasSecondaryFilter: true
    };
  }
  return defaultConfig;
};

export default getConfig;
