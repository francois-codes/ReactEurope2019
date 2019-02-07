# APSportTopScorers-RN

React Native top scorers app for RanSports

## Description

This app pulls in sports player data from an API endpoint. This occurs once before mounting.

API documentation can be found here:
https://middleware.7tv.de/docs/#!/RAN_Applicaster_API/

End point used for APSportTopScorers-RN: /ran/applicaster/v1/goalscorer
Required parameters:

- key
- sport
- competition

Note: currently these parameters are hard coded to the following:
sport: fussball
competition: champions-league

## Data

Expected data, set in state:

`players`: Array

`players` is iterated over to form the list of players.

Each player consumes the following data:

score
person.name
person.image
team.name
