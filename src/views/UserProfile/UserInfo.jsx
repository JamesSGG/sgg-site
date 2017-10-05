// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Item } from 'semantic-ui-react'
import { autobind } from 'core-decorators'
import { property, sortBy } from 'lodash/fp'

import type { ChildProps } from 'react-apollo'

import type {
  UserQuery,
  AllGamesQuery,
  AllGamePlatformsQuery,
  CreatePlayedGameInput,
  UpdatePlayedGameInput,
} from 'types/graphql'

import type { ID } from 'types/graphql-custom'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'
// $FlowIgnore
import Q_ALL_GAMES from 'data/q-all-games.graphql'
// $FlowIgnore
import Q_ALL_GAME_PLATFORMS from 'data/q-all-game-platforms.graphql'
// $FlowIgnore
import M_CREATE_GAME_PLAYED from 'data/m-create-game-played.graphql'
// $FlowIgnore
import M_UPDATE_GAME_PLAYED from 'data/m-update-game-played.graphql'
// $FlowIgnore
import M_DELETE_GAME_PLAYED from 'data/m-delete-game-played.graphql'

import GamesPlayed from 'components/GamesPlayed'


type StateProps = {
  currentUserId: ?ID,
  isAuthenticated: boolean,
}

type OwnProps = {
  userId?: string,
}

type ApolloProps = {
  userResult: UserQuery,
  allGamesResult: AllGamesQuery,
  allGamePlatformsResult: AllGamePlatformsQuery,
  createPlayedGame: (input: CreatePlayedGameInput) => Promise<*>,
  updatePlayedGame: (input: UpdatePlayedGameInput) => Promise<*>,
  deletePlayedGame: (id: ID) => Promise<*>,
}

type Props =
  & ChildProps<*, *>
  & ApolloProps
  & StateProps
  & OwnProps


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@connect(mapStateToProps)
@graphql(M_CREATE_GAME_PLAYED, {
  props: ({ mutate }) => ({
    createPlayedGame: (input: CreatePlayedGameInput) => mutate({
      variables: {
        input,
      },
    }),
  }),
})
@graphql(M_UPDATE_GAME_PLAYED, {
  props: ({ mutate }) => ({
    updatePlayedGame: (input: UpdatePlayedGameInput) => mutate({
      variables: {
        input,
      },
    }),
  }),
})
@graphql(M_DELETE_GAME_PLAYED, {
  props: ({ mutate }) => ({
    deletePlayedGame: (id: ID) => mutate({
      variables: {
        id,
      },
    }),
  }),
})
@graphql(Q_USER, {
  name: 'userResult',
  // Skip if not logged in
  skip: ({ isAuthenticated }) => !isAuthenticated,
  options: ({ userId, currentUserId }) => ({
    variables: {
      id: userId || currentUserId,
    },
  }),
})
@graphql(Q_ALL_GAMES, {
  name: 'allGamesResult',
  // Skip if viewing someone else's profile (i.e. fields are not editable)
  skip: ({ currentUserId }) => !currentUserId,
})
@graphql(Q_ALL_GAME_PLATFORMS, {
  name: 'allGamePlatformsResult',
  // Skip if viewing someone else's profile (i.e. fields are not editable)
  skip: ({ currentUserId }) => !currentUserId,
})
@autobind
export default class UserInfo extends PureComponent<Props> {
  props: Props

  isCurrentUserProfile(): boolean {
    const { isAuthenticated, userId, currentUserId } = this.props

    if (!isAuthenticated) {
      return false
    }

    if (userId && currentUserId && userId === currentUserId) {
      return true
    }

    return !userId && Boolean(currentUserId)
  }

  sortGames = sortBy([
    property('gameTitle'),
  ])

  sortGamePlatforms = sortBy([
    property('platformName'),
  ])

  sortPlayedGames = sortBy([
    property(['game', 'gameTitle']),
    property(['gamePlatform', 'platformName']),
    property('gamerTag'),
  ])

  render() {
    const {
      loading,
      error,
      userResult,
      allGamesResult,
      allGamePlatformsResult,
      createPlayedGame,
      updatePlayedGame,
      deletePlayedGame,
    } = this.props

    if (loading || error || !userResult) {
      return null
    }

    const { user = {} } = userResult
    const { games = [] } = allGamesResult
    const { gamePlatforms = [] } = allGamePlatformsResult
    const { displayName, imageUrl, gamesPlayed } = user

    const isEditable = this.isCurrentUserProfile()

    const allGamesSorted = this.sortGames(games)
    const allGamePlatformsSorted = this.sortGamePlatforms(gamePlatforms)
    const playedGamesSorted = this.sortPlayedGames(gamesPlayed)

    return (
      <Item.Group>
        <Item>
          <Item.Image
            className="ui"
            src={imageUrl}
            width="200"
            height="200"
          />
          <Item.Content>
            <Item.Header>
              {displayName}
            </Item.Header>
            <Item.Description>
              <GamesPlayed
                allGames={allGamesSorted}
                allGamePlatforms={allGamePlatformsSorted}
                playedGames={playedGamesSorted}
                isEditable={isEditable}
                createRecord={createPlayedGame}
                updateRecord={updatePlayedGame}
                deleteRecord={deletePlayedGame}
              />
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
