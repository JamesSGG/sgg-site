
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Item, Table, Dropdown } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { DefaultChildProps } from 'react-apollo'

import { getCurrentUserId, getIsAuthenticated } from 'store/selectors'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'


type StateProps = {
  currentUserId: ?string,
  isAuthenticated: boolean,
}

type Props =
  & StateProps
  & DefaultChildProps<*, *>


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
export default class UserInfo extends Component {

  props: Props

  renderGamesPlayed() {
    const { isAuthenticated, userId, currentUserId } = this.props
    const isCurrentUserProfile = isAuthenticated && !userId && currentUserId

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

    const actionOptions = [
      {
        text: 'Edit',
        value: 'edit',
      },
      {
        text: 'Delete',
        value: 'delete',
      },
    ]

    const rowItems = [
      {
        gameTitle: 'League of Legends',
        gamePlatform: 'PC',
        gamerTag: 'XYZexampleTag',
      },
      {
        gameTitle: 'DotA 2',
        gamePlatform: 'PC',
        gamerTag: 'ABCexampleTag',
      },
    ]

    const renderRow = ({ gameTitle, gamePlatform, gamerTag }) => (
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
        {isCurrentUserProfile && (
          <Table.Cell>
            <Dropdown
              text=" "
              icon="ellipsis vertical"
              options={actionOptions}
            />
          </Table.Cell>
        )}
      </Table.Row>
    )

    return (
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Game
            </Table.HeaderCell>
            <Table.HeaderCell>
              Platform
            </Table.HeaderCell>
            <Table.HeaderCell>
              Gamer Tag
            </Table.HeaderCell>
            {isCurrentUserProfile && (
              <Table.HeaderCell>
                Actions
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rowItems.map(renderRow)}
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
    const { displayName, imageUrl } = user

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
              {this.renderGamesPlayed()}
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    )
  }
}
