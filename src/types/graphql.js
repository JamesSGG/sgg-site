/* @flow */
//  This file was automatically generated and should not be edited.

export type AddFriendInput = {|
  userId: string,
  friendId: string,
|};

export type AddGamePlayedInput = {|
  userId: string,
  game: AddGameInput,
  plaform?: ?AddGamePlatformInput,
  gamerTag?: ?string,
|};

export type AddGameInput = {|
  gameTitle?: ?string,
|};

export type AddGamePlatformInput = {|
  platformName?: ?string,
|};

export type EditGamePlayedInput = {|
  id: string,
  userId?: ?string,
  game?: ?EditGameInput,
  plaform?: ?EditGamePlatformInput,
  gamerTag?: ?string,
|};

export type EditGameInput = {|
  id: string,
  gameTitle?: ?string,
|};

export type EditGamePlatformInput = {|
  id: string,
  platformName?: ?string,
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

export type AddGamePlayedMutationVariables = {|
  input: AddGamePlayedInput,
|};

export type AddGamePlayedMutation = {|
  // Adds a game that a user has played
  addGamePlayed: ? {|
    __typename: "GamePlayed",
    // Record ID
    id: string,
    // The ID of the user that created the record
    userId: string,
    // The game record
    game: ? {|
      __typename: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // The platform name
      platformName: ?string,
    |},
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
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

export type CreateFriendForUserMutationVariables = {|
  id: string,
|};

export type CreateFriendForUserMutation = {|
  // Randomly generate a new user and add to specified user's friends list
  createFriendForUser: ? {|
    __typename: "User",
    // User ID
    id: string,
    // Display name
    displayName: ?string,
    // Avatar image URL
    imageUrl: ?string,
    // Timestamp of when the user was last active on the site
    lastSeenAt: ?any,
  |},
|};

export type DeleteGamePlayedMutationVariables = {|
  id: string,
|};

export type DeleteGamePlayedMutation = {|
  // Deletes an existing game that a user has played
  deleteGamePlayed: ?string,
|};

export type EditGamePlayedMutationVariables = {|
  input: EditGamePlayedInput,
|};

export type EditGamePlayedMutation = {|
  // Edits an existing game that a user has played
  editGamePlayed: ? {|
    __typename: "GamePlayed",
    // Record ID
    id: string,
    // The ID of the user that created the record
    userId: string,
    // The game record
    game: ? {|
      __typename: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // The platform name
      platformName: ?string,
    |},
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
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
      // The game record
      game: ? {|
        __typename: string,
        // The game title
        gameTitle: ?string,
      |},
      // The game platform
      gamePlatform: ? {|
        __typename: string,
        // The platform name
        platformName: ?string,
      |},
      // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
      gamerTag: ?string,
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

export type UserLastSeenAtChangedSubscription = {|
  // Is triggered when a user's "last_seen_at" timestamp is updated
  userLastSeenAtChanged: ? {|
    __typename: "UserLastSeenAtResult",
    userId: string,
    lastSeenAt: ?any,
  |},
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
    // The game record
    game: ? {|
      __typename: string,
      // The game title
      gameTitle: ?string,
    |},
    // The game platform
    gamePlatform: ? {|
      __typename: string,
      // The platform name
      platformName: ?string,
    |},
    // The user's Steam username, Xbox gamer tag, PSN name, etc. for this game
    gamerTag: ?string,
  |} >,
|};
