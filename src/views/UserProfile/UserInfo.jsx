// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Item, Button } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'

// $FlowIgnore
import Q_ALL_GAMES from 'data/q-all-games.graphql'

// $FlowIgnore
import Q_ALL_GAME_PLATFORMS from 'data/q-all-game-platforms.graphql'

// $FlowIgnore
import M_ADD_GAME_PLAYED from 'data/m-add-game-played.graphql'

// $FlowIgnore
import M_EDIT_GAME_PLAYED from 'data/m-edit-game-played.graphql'

// $FlowIgnore
import M_DELETE_GAME_PLAYED from 'data/m-delete-game-played.graphql'

import GamesPlayed from 'components/GamesPlayed'


type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps = {
  userId?: string,
}

type Props =
  & DefaultChildProps<*, *>
  & StateProps
  & OwnProps


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@connect(mapStateToProps)
@graphql(M_ADD_GAME_PLAYED, {
  name: 'addGamePlayed',
})
@graphql(M_EDIT_GAME_PLAYED, {
  name: 'editGamePlayed',
})
@graphql(M_DELETE_GAME_PLAYED, {
  name: 'deleteGamePlayed',
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

  render() {
    const {
      loading,
      error,
      userResult,
      allGamesResult,
      allGamePlatformsResult,
      addGamePlayed,
      editGamePlayed,
      deleteGamePlayed,
    } = this.props

    if (loading || error || !userResult) {
      return null
    }

    const { user = {} } = userResult
    const { games = [] } = allGamesResult
    const { gamePlatforms = [] } = allGamePlatformsResult
    const { displayName, imageUrl, gamesPlayed } = user
    const isEditable = this.isCurrentUserProfile()

    const updateRecord = (input) => editGamePlayed({
      variables: {
        input,
      },
    })

    const deleteRecord = (id) => deleteGamePlayed({
      variables: {
        id,
      },
    })

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
                gamesPlayed={gamesPlayed}
                allGames={games}
                allGamePlatforms={gamePlatforms}
                isEditable={isEditable}
                updateRecord={updateRecord}
                deleteRecord={deleteRecord}
              />
              {isEditable && (
                <Button primary onClick={addGamePlayed}>
                  Add new game
                </Button>
              )}
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
