// @flow

import React from 'react'
import { withStateHandlers, withProps } from 'recompose'
import { reduxForm, Field } from 'redux-form'
import { Table, Button } from 'semantic-ui-react'
import { compose, identity } from 'lodash/fp'

import type { FormProps } from 'redux-form'

import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

type StateProps = {
  isEditing: boolean,
}

type StateHandlerProps = {
  toggleEditing: () => StateProps,
}

type OwnProps = {
  gameTitle: ?string,
  gamePlatform: ?string,
  gamerTag: ?string,
  isEditable: boolean,
  handleSubmit: () => Promise<*>,
}

type Props =
  & FormProps
  & StateProps
  & StateHandlerProps
  & OwnProps

const defaultState = {
  isEditing: false,
}

const renderActionButtons = (props: Props) => {
  const {
    isEditable,
    isEditing,
    toggleEditing,
    reset,
  } = props

  if (!isEditable) {
    return null
  }

  const maybeReset = isEditing ? reset : identity

  const handleEditClick = compose(
    maybeReset,
    toggleEditing,
  )

  return (
    <Table.Cell>
      <Button
        basic
        size="tiny"
        onClick={handleEditClick}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
      <Button
        basic
        size="tiny"
      >
        Delete
      </Button>
    </Table.Cell>
  )
}

const renderRowIfEditing = (props: Props) => {
  const { id } = props

  const gameOptions = [
    {
      text: 'Overwatch',
      value: 'Overwatch',
    },
    {
      text: 'DotA 2',
      value: 'DotA 2',
    },
    {
      text: 'League of Legends',
      value: 'League of Legends',
    },
    {
      text: 'Rainbow 6: Siege',
      value: 'Rainbow 6: Siege',
    },
  ]

  const platformOptions = [
    {
      text: 'PC',
      value: 'pc',
    },
    {
      text: 'Xbox',
      value: 'xbox',
    },
    {
      text: 'PlayStation',
      value: 'playstation',
    },
  ]

  return (
    <Table.Row key={id}>
      <Table.Cell>
        <Field
          name="gameTitle"
          component={InputSelect}
          options={gameOptions}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="gamePlatform"
          component={InputSelect}
          options={platformOptions}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="gamerTag"
          component={InputText}
        />
      </Table.Cell>
      {renderActionButtons(props)}
    </Table.Row>
  )
}

const renderRowIfViewing = (props: Props) => {
  const {
    id,
    gameTitle,
    gamePlatform,
    gamerTag,
  } = props

  return (
    <Table.Row key={id}>
      <Table.Cell>
        {gameTitle}
      </Table.Cell>
      <Table.Cell>
        {gamePlatform}
      </Table.Cell>
      <Table.Cell>
        {gamerTag}
      </Table.Cell>
      {renderActionButtons(props)}
    </Table.Row>
  )
}

const renderRow = (props: Props) => (
  props.isEditing
    ? renderRowIfEditing(props)
    : renderRowIfViewing(props)
)

const enhancer = compose(
  withProps((props: Props) => ({
    form: props.gameTitle,
    initialValues: props,
  })),
  withStateHandlers(defaultState, {
    toggleEditing: ({ isEditing }) => () => ({
      isEditing: !isEditing,
    }),
  }),
  reduxForm(),
)

export default enhancer(renderRow)
