
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Grid, Item, Header, Table, Input, Dropdown } from 'semantic-ui-react'
import { autobind } from 'core-decorators'

import type { DefaultChildProps } from 'react-apollo'

// $FlowIgnore
import Q_USER from 'data/q-user.graphql'


type Props = DefaultChildProps<*, *>;


const { localStorage } = window

const currentUserId = localStorage.getItem('userId')

@graphql(Q_USER, {
  name: 'userQueryResult',
  skip: !currentUserId,
  options: ({ userId }) => ({
    variables: {
      id: userId || currentUserId,
    },
  }),
})
@autobind
export default class UserInfo extends Component {

  props: Props

  renderGamesPlayed() {
    const { userId } = this.props

    if (userId) {
      return (
        <Table basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Games Played
              </Table.HeaderCell>
              <Table.HeaderCell>
                Gamer Tag
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>
                League of Legends
              </Table.Cell>
              <Table.Cell>
                XYZexampleTag
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                DotA 2
              </Table.Cell>
              <Table.Cell>
                ABCexampleTag
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )
    }

    const gamesPlayedOptions = [
      {
        text: 'Overwatch',
        value: 'overwatch',
      },
      {
        text: 'DotA 2',
        value: 'dota2',
      },
      {
        text: 'League of Legends',
        value: 'league-of-legends',
      },
      {
        text: 'Rainbow 6: Siege',
        value: 'rainbow-6-siege',
      },
    ]

    return (
      <Table basic="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="8">
              Games Played
            </Table.HeaderCell>
            <Table.HeaderCell width="8">
              Gamer Tag
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Dropdown
                fluid
                selection
                multiple
                placeholder="Select game(s)"
                options={gamesPlayedOptions}
              />
            </Table.Cell>
            <Table.Cell>
              <Input
                fluid
                icon="tag"
                iconPosition="left"
                placeholder="Enter gamer tag"
              />
            </Table.Cell>
          </Table.Row>
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
