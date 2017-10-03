// @flow

import React from 'react'
import { Table } from 'semantic-ui-react'
import { complement, allPass, isArray, isEmpty } from 'lodash/fp'

import type { Game, GamePlatform, GamePlayed } from 'types/graphql-custom'

import InfoTooltip from 'components/InfoTooltip'

import GamesPlayedRow from './Row'

type Props = {
  allGames: Array<Game>,
  allGamePlatforms: Array<GamePlatform>,
  gamesPlayed: Array<GamePlayed>,
  isEditable: boolean,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
}

export default function GamesPlayedTable(props: Props) {
  const {
    allGames,
    allGamePlatforms,
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
      allGames={allGames}
      allGamePlatforms={allGamePlatforms}
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
