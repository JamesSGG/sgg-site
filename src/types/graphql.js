/* @flow */
//  This file was automatically generated and should not be edited.

export type AddFriendInput = {|
  userId: string,
  friendId: string,
|};

export type UserStatus =
  "online" |
  "offline";


export type UserStatusInput = {|
  userId: string,
  status?: ?UserStatus,
|};

export type UserListInput = {|
  userIds?: ?Array< ?string >,
|};

export type AddFriendToUserMutationVariables = {|
  input: AddFriendInput,
|};

export type AddFriendToUserMutation = {|
  addFriendToUser: ? {|
    __typename: "AddFriendResult",
    userId: ?string,
    friendId: ?string,
  |},
|};

export type CreateFriendForUserMutationVariables = {|
  id: string,
|};

export type CreateFriendForUserMutation = {|
  createFriendForUser: ? {|
    __typename: "User",
    id: string,
    displayName: ?string,
    imageUrl: ?string,
    onlineStatus: ?UserStatus,
  |},
|};

export type SetUserOnlineStatusMutationVariables = {|
  input: UserStatusInput,
|};

export type SetUserOnlineStatusMutation = {|
  setUserOnlineStatus: ? {|
    __typename: "UserStatusInfo",
    userId: string,
    status: ?UserStatus,
  |},
|};

export type AllUsersQuery = {|
  users: ? Array<? {|
    __typename: "undefined",
    id: string,
    displayName: ?string,
    imageUrl: ?string,
  |} >,
|};

export type CurrentUserQuery = {|
  currentUser: ? {|
    __typename: "User",
    id: string,
    displayName: ?string,
    imageUrl: ?string,
    emails: ? Array<? {|
      __typename: string,
      email: string,
      verified: ?boolean,
    |} >,
    friends: ? Array<? {|
      __typename: string,
      id: string,
      displayName: ?string,
      imageUrl: ?string,
      onlineStatus: ?UserStatus,
    |} >,
  |},
|};

export type UserQueryVariables = {|
  id: string,
|};

export type UserQuery = {|
  user: ? {|
    __typename: "User",
    id: string,
    displayName: ?string,
    imageUrl: ?string,
    emails: ? Array<? {|
      __typename: string,
      email: string,
      verified: ?boolean,
    |} >,
    gamesPlayed: ? Array<? {|
      __typename: string,
      gameTitle: ?string,
      gamePlatform: ?string,
      gamerTag: ?string,
    |} >,
    friends: ? Array<? {|
      __typename: string,
      id: string,
      displayName: ?string,
      imageUrl: ?string,
      onlineStatus: ?UserStatus,
    |} >,
    nonFriends: ? Array<? {|
      __typename: string,
      id: string,
      displayName: ?string,
      imageUrl: ?string,
      onlineStatus: ?UserStatus,
    |} >,
  |},
|};

export type onUserOnlineStatusChangedSubscriptionVariables = {|
  input?: ?UserListInput,
|};

export type onUserOnlineStatusChangedSubscription = {|
  userOnlineStatusChanged: ? {|
    __typename: "UserStatusInfo",
    userId: string,
    status: ?UserStatus,
  |},
|};

export type userInfoFragment = {|
  __typename: string,
  id: string,
  displayName: ?string,
  imageUrl: ?string,
|};

export type userEmailsFragment = {|
  __typename: string,
  emails: ? Array<? {|
    __typename: string,
    email: string,
    verified: ?boolean,
  |} >,
|};

export type userProfileFragment = {|
  __typename: string,
  gamesPlayed: ? Array<? {|
    __typename: string,
    gameTitle: ?string,
    gamePlatform: ?string,
    gamerTag: ?string,
  |} >,
|};
