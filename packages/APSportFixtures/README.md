# APSportFixtures-RN
React Native sport fixtures app for RanSports

## Description

This app pulls in sports event data from an API endpoint. This occurs before mounting and every 30 seconds after that.

API documentation can be found here:
https://middleware.7tv.de/docs/#!/RAN_Applicaster_API/

End point used for APSportFixtures-RN: /ran/applicaster/v1/events
Required parameters:
 - key
 - sport
 - competition

Note: currently these parameters are hard coded to the following:
sport: fussball
competition: champions-league

## Data

Expected data, set in state:

`match`: Array
`appContext`: String

`match` is iterated over to form the list of fixtures. 

Each fixture consumes the following data:

id
finished
home.team_detail.image
away.team_detail.image
venue.name
venue.kind
match_result[0].match_result
match_result[1].match_result
home.name
home.shortname
away.name
away.shortname
match_date
match_time

TODO: 
 - need a way to derive live status.
 - need current duration of live game

## Context Switching

Fixtures can be grouped by a specified property within the `match` array. Similarly, fixtures can be filtered by a specified property within the `match` array.

This behaviour is driven by the `appContext` string received by the app. The expected possible values for `appContext` are:

 - homeScreen
 - competitionScreen
 - teamScreen
 - liveScreen

These options drive the following configurations:

homeScreen:
  Title: No title
  Filter: No filter
  Grouping: 
    Group by: `matchday`
    Label prefix: `COMPETITION GW `

competitionScreen
  Title: No title
  Filter:
    Filter by: `match_date`
    Label prefix: ``
  Grouping: 
    Group by: `matchday`
    Label prefix: `Gameweek `

teamScreen
  Title: No title
  Filter:
    Filter by: `match_date`
    Label prefix: ``
  Grouping: 
    Group by: `matchday`
    Label prefix: `Gameweek `

liveScreen
  Title: `LIVE FIXTURES`
  Filter: No filter
  Grouping: 
    Group by: `matchday`
    Label prefix: `Gameweek `