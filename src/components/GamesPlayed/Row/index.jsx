// @flow

import React from 'react'
import { connect } from 'react-redux'
import { withStateHandlers, withProps } from 'recompose'
import { reduxForm, formValueSelector, Field } from 'redux-form'
import { Table, Button } from 'semantic-ui-react'
import { compose, noop } from 'lodash/fp'

import type { FormProps } from 'redux-form'

import type {
  ID,
  Game,
  GamePlatform,
  PlayedGame,
} from 'types/graphql-custom'

import { getCurrentUserId } from 'store/selectors'

import InputText from 'components/InputText'
import InputSelect from 'components/InputSelect'

import './styles.css'

type StateProps = {
  isProcessing: boolean,
  isEditing: boolean,
}

type StateHandlerProps = {
  setProcessingStatus: () => StateProps,
  toggleEditing: () => StateProps,
}

type OwnProps = {
  ...PlayedGame,
  currentUserId: ?ID,
  isEditable: boolean,
  isNewRecord: boolean,
  formName: string,
  allGames: Array<Game>,
  allGamePlatforms: Array<GamePlatform>,
  createRecord: (input: *) => Promise<*>,
  updateRecord: (input: *) => Promise<*>,
  deleteRecord: (input: *) => Promise<*>,
  handleAfterCreate: () => *,
}

type Props =
  & FormProps
  & StateProps
  & StateHandlerProps
  & OwnProps

const renderActionButtons = (props: Props) => {
  const {
    isEditable,
    isEditing,
    isNewRecord,
    isProcessing,
    toggleEditing,
    setProcessingStatus,
    createRecord,
    updateRecord,
    deleteRecord,
    handleAfterCreate = noop,
    reset,
  } = props

  if (!isEditable) {
    return null
  }

  const handleDelete = async () => {
    const { id } = props

    setProcessingStatus(true)

    await deleteRecord(id)
  }

  const handleCreate = async () => {
    const { currentUserId, currentFormValues } = props
    const { gameId, platformId, gamerTag } = currentFormValues

    setProcessingStatus(true)

    await createRecord({
      userId: currentUserId,
      gameId,
      platformId,
      gamerTag,
    })

    setProcessingStatus(false)
    toggleEditing()
    handleAfterCreate()
  }

  const handleUpdate = async () => {
    const { id, userId, currentFormValues } = props
    const { gameId, platformId, gamerTag } = currentFormValues

    setProcessingStatus(true)

    await updateRecord({
      id,
      userId,
      gameId,
      platformId,
      gamerTag,
    })

    setProcessingStatus(false)
    toggleEditing()
  }

  const handleCancel = () => {
    reset()
    toggleEditing()
  }

  if (isNewRecord) {
    return (
      <Table.Cell styleName="action-buttons-cell">
        <Button
          basic
          size="tiny"
          disabled={isProcessing}
          onClick={handleCreate}
        >
          Create
        </Button>
      </Table.Cell>
    )
  }

  if (isEditing) {
    return (
      <Table.Cell styleName="action-buttons-cell">
        <Button
          basic
          size="tiny"
          disabled={isProcessing}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          basic
          size="tiny"
          disabled={isProcessing}
          onClick={handleUpdate}
        >
          Update
        </Button>
      </Table.Cell>
    )
  }

  return (
    <Table.Cell styleName="action-buttons-cell">
      <Button
        basic
        size="tiny"
        disabled={isProcessing}
        onClick={toggleEditing}
      >
        Edit
      </Button>
      <Button
        basic
        size="tiny"
        disabled={isProcessing}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </Table.Cell>
  )
}

const renderRowIfEditing = (props: Props) => {
  const {
    id,
    allGames,
    allGamePlatforms,
    isProcessing,
  } = props

  const gameOptions = allGames.map((item) => ({
    text: item.gameTitle,
    value: item.id,
  }))

  const platformOptions = allGamePlatforms.map((item) => ({
    text: item.platformName,
    value: item.id,
  }))

  return (
    <Table.Row key={id} disabled={isProcessing}>
      <Table.Cell>
        <Field
          name="gameId"
          component={InputSelect}
          options={gameOptions}
          disabled={isProcessing}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="platformId"
          component={InputSelect}
          options={platformOptions}
          disabled={isProcessing}
        />
      </Table.Cell>
      <Table.Cell>
        <Field
          name="gamerTag"
          component={InputText}
          disabled={isProcessing}
        />
      </Table.Cell>
      {renderActionButtons(props)}
    </Table.Row>
  )
}

const renderRowIfViewing = (props: Props) => {
  const {
    id,
    game = {},
    gamePlatform = {},
    gamerTag,
    isProcessing,
  } = props

  return (
    <Table.Row key={id} disabled={isProcessing}>
      <Table.Cell >
        {game.gameTitle}
      </Table.Cell>
      <Table.Cell>
        {gamePlatform.platformName}
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

const mapStateToProps = (state: *, ownProps: Props) => {
  const formSelector = formValueSelector(ownProps.formName)

  return {
    currentUserId: getCurrentUserId(state),
    currentFormValues: formSelector(
      state,
      'gameId',
      'platformId',
      'gamerTag',
    ),
  }
}

const enhancer = compose(
  connect(mapStateToProps),

  withProps(({ formName, gamerTag, game = {}, gamePlatform = {} }: Props) => ({
    form: formName,
    initialValues: {
      gamerTag,
      gameId: game.id,
      platformId: gamePlatform.id,
    },
  })),

  withStateHandlers(
    ({
      isProcessing = false,
      isEditing = false,
      isNewRecord = false,
    }) => ({
      isProcessing,
      isEditing: isEditing || isNewRecord,
    }),
    {
      setProcessingStatus: () => (isProcessing) => ({
        isProcessing,
      }),
      toggleEditing: ({ isEditing }) => () => ({
        isEditing: !isEditing,
      }),
    },
  ),

  reduxForm(),
)

const PlayedGameRow = enhancer(renderRow)

export default PlayedGameRow
