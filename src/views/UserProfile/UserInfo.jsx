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
@graphql(Q_USER, {
  skip: ({ isAuthenticated }) => !isAuthenticated,
  options: ({ userId, currentUserId }) => ({
    variables: {
      id: userId || currentUserId,
    },
  }),
})
@autobind
export default class UserInfo extends PureComponent<Props> {
  props: Props

  isCurrentUserProfile() {
    const { isAuthenticated, userId, currentUserId } = this.props

    return isAuthenticated && !userId && currentUserId
  }

  render() {
    const {
      loading,
      error,
      data,
    } = this.props

    if (loading || error || !data) {
      return null
    }

    const { user = {} } = data
    const { displayName, imageUrl, gamesPlayed } = user
    const isEditable = this.isCurrentUserProfile()

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
                isEditable={isEditable}
                handleSubmit={async () => false}
              />
              {isEditable && <Button primary>Add new game</Button>}
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
