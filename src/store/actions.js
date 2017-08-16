// @flow

import { createActions } from 'redux-actions'

export default createActions({
  CURRENT_USER: {
    LOGIN: (userId) => ({
      userId,
      isAuthenticated: true,
    }),
    LOGOUT: () => ({
      user: null,
      isAuthenticated: false,
    }),
  },
})
