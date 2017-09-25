// @flow

import React from 'react'
import { Table } from 'semantic-ui-react'
import { complement, allPass, isArray, isEmpty } from 'lodash/fp'

import InfoTooltip from 'components/InfoTooltip'

import GamesPlayedRow from './Row'

type GamePlayed = {
  id: string,
  gameTitle: ?string,
  gamePlatform: ?string,
  gamerTag: ?string,
}

type Props = {
  gamesPlayed: Array<GamePlayed>,
  isEditable: boolean,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
}

export default function GamesPlayedTable(props: Props) {
  const {
    gamesPlayed,
    isEditable,
    updateRecord,
    deleteRecord,
  } = props

  const isNonEmptyArray = allPass([
    isArray,
    complement(isEmpty),
  ])

  const renderRow = (gamePlayed: GamePlayed) => (
    <GamesPlayedRow
      {...gamePlayed}
      key={gamePlayed.id}
      isEditable={isEditable}
      updateRecord={updateRecord}
      deleteRecord={deleteRecord}
    />
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
            <InfoTooltip
              wide
              content="Xbox Live gamer tag, PSN user name, Steam ID, etc."
            />
          </Table.HeaderCell>
          {isEditable && (
            <Table.HeaderCell>
              Actions
            </Table.HeaderCell>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isNonEmptyArray(gamesPlayed) && gamesPlayed.map(renderRow)}
      </Table.Body>
    </Table>
  )
}
