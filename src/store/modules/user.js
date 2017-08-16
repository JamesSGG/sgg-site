// @flow

import { createActions, handleActions } from 'redux-actions'

type User = {
  id: string,
  displayName: string,
  imageUrl: string,
}

export type CurrentUserState = {
  isAuthenticated: boolean,
  user: ?User,
}

export const initialState: CurrentUserState = {
  isAuthenticated: false,
  user: null,
}

export const actionCreators = createActions({
  LOGIN: (user) => ({
    isAuthenticated: true,
    user,
  }),
  LOGOUT: () => ({
    isAuthenticated: false,
    user: null,
  }),
})
