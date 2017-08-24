// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Item, Table, Button } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { DefaultChildProps } from 'react-apollo'

import type { UserQuery } from 'types/graphql'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'

import InfoTooltip from 'components/InfoTooltip'


/* eslint-disable react/no-unused-prop-types */
type GamePlayed = {
  gameTitle: ?string,
  gamePlatform: ?string,
  gamerTag: ?string,
}
/* eslint-enable react/no-unused-prop-types */

type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type OwnProps = {
  userId?: string,
}

type QueryProps = {
  userQueryResult: UserQuery,
}

type Props =
  & DefaultChildProps<QueryProps, *>
  & StateProps
  & OwnProps


const mapStateToProps = (state) => ({
  currentUserId: getCurrentUserId(state),
  isAuthenticated: getIsAuthenticated(state),
})

@connect(mapStateToProps)
@graphql(Q_USER, {
  name: 'userQueryResult',
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

  renderHeaderRow() {
    return (
      <Table.Row>
        <Table.HeaderCell>
          Game
        </Table.HeaderCell>
        <Table.HeaderCell>
          Platform
        </Table.HeaderCell>
        <Table.HeaderCell>
          Gamer Tag
          <InfoTooltip
            wide
            content="Xbox Live gamer tag, PSN user name, Steam ID, etc."
          />
        </Table.HeaderCell>
        {this.isCurrentUserProfile() && (
          <Table.HeaderCell>
            Actions
          </Table.HeaderCell>
        )}
      </Table.Row>
    )
  }

  renderBodyRow({ gameTitle, gamePlatform, gamerTag }: GamePlayed) {
    return (
      <Table.Row key={gameTitle}>
        <Table.Cell>
          {gameTitle}
        </Table.Cell>
        <Table.Cell>
          {gamePlatform}
        </Table.Cell>
        <Table.Cell>
          {gamerTag}
        </Table.Cell>
        {this.isCurrentUserProfile() && (
          <Table.Cell>
            <Button basic size="tiny">Delete</Button>
            <Button primary size="tiny">Edit</Button>
          </Table.Cell>
        )}
      </Table.Row>
    )
  }

  renderGamesPlayed(gamesPlayed?: Array<GamePlayed> = []) {
    // const gameOptions = [
    //   {
    //     text: 'Overwatch',
    //     value: 'overwatch',
    //   },
    //   {
    //     text: 'DotA 2',
    //     value: 'dota2',
    //   },
    //   {
    //     text: 'League of Legends',
    //     value: 'league-of-legends',
    //   },
    //   {
    //     text: 'Rainbow 6: Siege',
    //     value: 'rainbow-6-siege',
    //   },
    // ]
    //
    // const platformOptions = [
    //   {
    //     text: 'PC',
    //     value: 'pc',
    //   },
    //   {
    //     text: 'Xbox',
    //     value: 'xbox',
    //   },
    //   {
    //     text: 'PlayStation',
    //     value: 'playstation',
    //   },
    // ]

    return (
      <Table basic="very">
        <Table.Header>
          {this.renderHeaderRow()}
        </Table.Header>
        <Table.Body>
          {gamesPlayed.map(this.renderBodyRow)}
        </Table.Body>
      </Table>
    )
  }

  render() {
    const { userQueryResult, loading, error } = this.props

    if (loading || error || !userQueryResult) {
      return null
    }

    const { user = {} } = userQueryResult
    const { displayName, imageUrl, gamesPlayed } = user

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
              {this.renderGamesPlayed(gamesPlayed)}
              <Button primary>Add new game</Button>
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
