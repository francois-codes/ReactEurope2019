export const getSubTitle = (matchday, groupMatchday, round) => {
  if (groupMatchday && groupMatchday !== '0') {
    return `Spieltag ${groupMatchday}`;
  } else if (round && round !== '0') {
    return `Runde ${round}`;
  } else if (matchday && matchday !== '0') {
    return `Spieltag ${matchday}`;
  }
  return '';
};

export const legNames = ['Hinspiel', 'Rückspiel'];
