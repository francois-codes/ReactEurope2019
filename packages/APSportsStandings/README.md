# APSportStandings-RN
React Native sport standings app for RanSports

## Description

This app pulls in sports standings data from an API endpoint. This occurs once, before mounting.

API documentation can be found here:
https://middleware-preprod.7tv.de/docs/#!/RAN_Applicaster_API/

End point used for APSportFixtures-RN: /ran/applicaster/v1/standings
Required parameters:
 - key
 - sport
 - competition

Note: currently these parameters are hard coded to the following:
sport: fussball
competition: champions-league

Note: In a future update, these properties will need to be provided in `extra_props`;

## Data

Expected data, set in state:

`standing`: Array

`standing` is iterated over to form the list of standings. 

Each standing consumes the following data:

team.shortname
team.image
rank
difference
draw
last_rank
lost
matches
points
score
