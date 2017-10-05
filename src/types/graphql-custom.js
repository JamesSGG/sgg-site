// @flow

export type ID = string
export type JSON = string
export type Date = string
export type Time = string
export type DateTime = string
export type URL = string
export type AbsoluteURL = string
export type RelativeURL = string

// A game record
export type Game = {
  // Record ID
  id: ID,

  // The game title
  gameTitle: string,
}

// A game platform record
export type GamePlatform = {
  // Record ID
  id: ID,

  // The platform name
  platformName: string,
}

// A game that has been played by a user
export type PlayedGame = {
  // Record ID
  id: ID,

  // Timestamp of when the record was created
  createdAt: ?DateTime,

  // Timestamp of when the record was last updated
  updatedAt: ?DateTime,

  // The ID of the user that created the record
  userId: ID,

  // The game record
  game: ?Game,

  // The game platform
  gamePlatform: ?GamePlatform,

  // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
  gamerTag: ?String,
}
