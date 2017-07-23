/* @flow */
//  This file was automatically generated and should not be edited.

export type AddFriendInput = {|
  +userId: string,
  +friendId: string,
|};

export type UserStatus =
  "online" |
  "offline";


export type UserStatusInput = {|
  +userId: string,
  +status?: ?UserStatus,
|};

export type UserListInput = {|
  +userIds?: ?$ReadOnlyArray< ?string >,
|};

export type AddFriendToUserMutationVariables = {|
  +input: AddFriendInput,
|};

export type AddFriendToUserMutation = {|
  // Adds a friend to a user
  +addFriendToUser: ? {|
    +__typename: string,
    +userId: ?string,
    +friendId: ?string,
  |},
|};

export type CreateFriendForUserMutationVariables = {|
  id: string,
|};

export type CreateFriendForUserMutation = {|
  // Randomly generate a new user and add to specified user's friends list
  +createFriendForUser: ? {|
    +__typename: string,
    // User ID
    +id: string,
    // Display name
    +displayName: ?string,
    // Avatar image URL
    +imageUrl: ?string,
    // Online status
    +onlineStatus: ?UserStatus,
  |},
|};

export type SetUserOnlineStatusMutationVariables = {|
  +input: UserStatusInput,
|};

export type SetUserOnlineStatusMutation = {|
  // Sets a user's online / offline status
  +setUserOnlineStatus: ? {|
    +__typename: string,
    +userId: string,
    +status: ?UserStatus,
  |},
|};

export type AllUsersQuery = {|
  // Fetch all users
  +users: ? $ReadOnlyArray< {|
    +__typename: string,
    // User ID
    +id: string,
    // Display name
    +displayName: ?string,
    // Avatar image URL
    +imageUrl: ?string,
  |} >,
|};

export type CurrentUserQuery = {|
  // Fetch the current logged-in user
  +currentUser: ? {|
    +__typename: string,
    // User ID
    +id: string,
    // Display name
    +displayName: ?string,
    // Avatar image URL
    +imageUrl: ?string,
    // Emails
    +emails: ? $ReadOnlyArray< {|
      +__typename: string,
      // Email address
      +email: string,
      // Is email verified? (pulled from Facebook profile data)
      +verified: ?boolean,
    |} >,
    // Friends
    +friends: ? $ReadOnlyArray< {|
      +__typename: string,
      // User ID
      +id: string,
      // Display name
      +displayName: ?string,
      // Avatar image URL
      +imageUrl: ?string,
      // Online status
      +onlineStatus: ?UserStatus,
    |} >,
  |},
|};

export type UserQueryVariables = {|
  +id: string,
|};

export type UserQuery = {|
  // Fetch a specific user by ID
  +user: ? {|
    +__typename: string,
    // User ID
    +id: string,
    // Display name
    +displayName: ?string,
    // Avatar image URL
    +imageUrl: ?string,
    // Emails
    +emails: ? $ReadOnlyArray< {|
      +__typename: string,
      // Email address
      +email: string,
      // Is email verified? (pulled from Facebook profile data)
      +verified: ?boolean,
    |} >,
    // Friends
    +friends: ? $ReadOnlyArray< {|
      +__typename: string,
      // User ID
      +id: string,
      // Display name
      +displayName: ?string,
      // Avatar image URL
      +imageUrl: ?string,
      // Online status
      +onlineStatus: ?UserStatus,
    |} >,
  |},
|};

export type OnUserOnlineStatusChangedSubscriptionVariables = {|
  +input?: ?UserListInput,
|};

export type OnUserOnlineStatusChangedSubscription = {|
  // Is triggered when a user's online / offline status changes
  +userOnlineStatusChanged: ? {|
    +__typename: string,
    +userId: string,
    +status: ?UserStatus,
  |},
|};

export type UserEmailsFragment = {|
  +__typename: string,
  // Emails
  +emails: ? $ReadOnlyArray< {|
    +__typename: string,
    // Email address
    +email: string,
    // Is email verified? (pulled from Facebook profile data)
    +verified: ?boolean,
  |} >,
|};

export type UserInfoFragment = {|
  +__typename: string,
  // User ID
  +id: string,
  // Display name
  +displayName: ?string,
  // Avatar image URL
  +imageUrl: ?string,
|};
