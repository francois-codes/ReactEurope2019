# APSportInfo-RN

React Native sport info app for RanSports

## Description

This app pulls in sports team info data from an API endpoint. This occurs once before mounting.

API documentation can be found here:
https://middleware.7tv.de/docs/#!/RAN_Applicaster_API/

End point used for APSportInfo-RN: /ran/applicaster/v1/team-info
Required parameters:

- key
- sport
- competition
- team

Note: currently these parameters are hard coded to the following:
sport: fussball
competition: champions-league
team: apoel

## Data

Expected data, set in state:
`info`: Object

Properties consumed:

image
name
team_detail.fullname

TODO:
need a squad list with image, name and position of each player
