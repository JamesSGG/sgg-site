/* @flow */
//  This file was automatically generated and should not be edited.

export type AddFriendInput = {|
  userId: string,
  friendId: string,
|};

export type CreatePlayedGameInput = {|
  userId: string,
  gameId: string,
  platformId?: ?string,
  gamerTag?: ?string,
|};

export type UpdatePlayedGameInput = {|
  id: string,
  userId?: ?string,
  gameId?: ?string,
  platformId?: ?string,
  gamerTag?: ?string,
|};

export type AddFriendToUserMutationVariables = {|
  input: AddFriendInput,
|};

export type AddFriendToUserMutation = {|
  // Adds a friend to a user
  addFriendToUser: ? {|
    __typename: "AddFriendResult",
    userId: ?string,
    friendId: ?string,
  |},
|};

export type BumpUserLastSeenAtMutationVariables = {|
  id: string,
|};

export type BumpUserLastSeenAtMutation = {|
  // Sets the "last_seen_at" timestamp to "now" for the specified user, which is
  // then used to determine whether the user is "online" or "offline".
  bumpUserLastSeenAt: ? {|
    __typename: "UserLastSeenAtResult",
    userId: string,
    lastSeenAt: ?any,
  |},
|};

export type CreatePlayedGameMutationVariables = {|
  input: CreatePlayedGameInput,
|};

export type CreatePlayedGameMutation = {|
  // Creates a game that a user has played
  createPlayedGame: ? {|
    __typename: "PlayedGame",
    // Record ID
    id: string,
    // The ID of the user that created the record
    userId: string,
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
    // The game record
    game: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The platform name
      platformName: ?string,
    |},
  |},
|};

export type DeletePlayedGameMutationVariables = {|
  id: string,
|};

export type DeletePlayedGameMutation = {|
  // Deletes an existing game that a user has played
  deletePlayedGame: ?string,
|};

export type UpdatePlayedGameMutationVariables = {|
  input: UpdatePlayedGameInput,
|};

export type UpdatePlayedGameMutation = {|
  // Updates an existing game that a user has played
  updatePlayedGame: ? {|
    __typename: "PlayedGame",
    // Record ID
    id: string,
    // The ID of the user that created the record
    userId: string,
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
    // The game record
    game: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The platform name
      platformName: ?string,
    |},
  |},
|};

export type AllGamePlatformsQuery = {|
  // Fetch all game platforms
  gamePlatforms: ? Array<? {|
    __typename: "undefined",
    // Record ID
    id: string,
    // The platform name
    platformName: ?string,
  |} >,
|};

export type AllGamesQuery = {|
  // Fetch all games
  games: ? Array<? {|
    __typename: "undefined",
    // Record ID
    id: string,
    // The game title
    gameTitle: ?string,
  |} >,
|};

export type AllUsersQuery = {|
  // Fetch all users
  users: ? Array<? {|
    __typename: "undefined",
    // User ID
    id: string,
    // Display name
    displayName: ?string,
    // Avatar image URL
    imageUrl: ?string,
  |} >,
|};

export type CurrentUserQuery = {|
  // Fetch the current logged-in user
  currentUser: ? {|
    __typename: "User",
    // User ID
    id: string,
    // Display name
    displayName: ?string,
    // Avatar image URL
    imageUrl: ?string,
    // Emails
    emails: ? Array<? {|
      __typename: string,
      // Email address
      email: string,
      // Is email verified? (pulled from Facebook profile data)
      verified: ?boolean,
    |} >,
    // Friends
    friends: ? Array<? {|
      __typename: string,
      // User ID
      id: string,
      // Display name
      displayName: ?string,
      // Avatar image URL
      imageUrl: ?string,
      // Timestamp of when the user was last active on the site
      lastSeenAt: ?any,
    |} >,
  |},
|};

export type UserQueryVariables = {|
  id: string,
|};

export type UserQuery = {|
  // Fetch a specific user by ID
  user: ? {|
    __typename: "User",
    // User ID
    id: string,
    // Display name
    displayName: ?string,
    // Avatar image URL
    imageUrl: ?string,
    // Emails
    emails: ? Array<? {|
      __typename: string,
      // Email address
      email: string,
      // Is email verified? (pulled from Facebook profile data)
      verified: ?boolean,
    |} >,
    // Games played
    gamesPlayed: ? Array<? {|
      __typename: string,
      // Record ID
      id: string,
      // The ID of the user that created the record
      userId: string,
      // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
      gamerTag: ?string,
      // The game record
      game: ? {|
        __typename: string,
        // Record ID
        id: string,
        // The game title
        gameTitle: ?string,
      |},
      // The game platform
      gamePlatform: ? {|
        __typename: string,
        // Record ID
        id: string,
        // The platform name
        platformName: ?string,
      |},
    |} >,
    // Friends
    friends: ? Array<? {|
      __typename: string,
      // User ID
      id: string,
      // Display name
      displayName: ?string,
      // Avatar image URL
      imageUrl: ?string,
      // Timestamp of when the user was last active on the site
      lastSeenAt: ?any,
    |} >,
    // All other users besides friends
    nonFriends: ? Array<? {|
      __typename: string,
      // User ID
      id: string,
      // Display name
      displayName: ?string,
      // Avatar image URL
      imageUrl: ?string,
      // Timestamp of when the user was last active on the site
      lastSeenAt: ?any,
    |} >,
  |},
|};

export type userLastSeenAtUpdatedSubscription = {|
  // Is triggered when a user's "last_seen_at" timestamp is updated
  userLastSeenAtUpdated: ? {|
    __typename: "UserLastSeenAtResult",
    userId: string,
    lastSeenAt: ?any,
  |},
|};

export type gamePlatformFragment = {|
  __typename: string,
  // Record ID
  id: string,
  // The platform name
  platformName: ?string,
|};

export type playedGameFragment = {|
  __typename: string,
  // Record ID
  id: string,
  // The ID of the user that created the record
  userId: string,
  // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
  gamerTag: ?string,
  // The game record
  game: ? {|
    __typename: string,
    // Record ID
    id: string,
    // The game title
    gameTitle: ?string,
  |},
  // The game platform
  gamePlatform: ? {|
    __typename: string,
    // Record ID
    id: string,
    // The platform name
    platformName: ?string,
  |},
|};

export type gameFragment = {|
  __typename: string,
  // Record ID
  id: string,
  // The game title
  gameTitle: ?string,
|};

export type userEmailsFragment = {|
  __typename: string,
  // Emails
  emails: ? Array<? {|
    __typename: string,
    // Email address
    email: string,
    // Is email verified? (pulled from Facebook profile data)
    verified: ?boolean,
  |} >,
|};

export type userInfoFragment = {|
  __typename: string,
  // User ID
  id: string,
  // Display name
  displayName: ?string,
  // Avatar image URL
  imageUrl: ?string,
|};

export type userProfileFragment = {|
  __typename: string,
  // Games played
  gamesPlayed: ? Array<? {|
    __typename: string,
    // Record ID
    id: string,
    // The ID of the user that created the record
    userId: string,
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
    // The game record
    game: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // Record ID
      id: string,
      // The platform name
      platformName: ?string,
    |},
  |} >,
|};