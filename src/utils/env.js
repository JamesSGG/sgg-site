// @flow

import { complement } from 'lodash/fp'
import { branch, renderNothing } from 'recompose'


export const isProd = () => process.env.NODE_ENV === 'production'
export const isDev = complement(isProd)

export const devOnlyComponent = branch(
  isProd,
  renderNothing,
)
