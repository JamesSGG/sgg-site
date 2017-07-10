// @flow

import React from 'react'
import Loadable from 'react-loadable'

import { isProd } from 'utils/env'


type Props = {}

export default function AppPerformance(props: Props) {
  if (isProd()) {
    return null
  }

  import('react-perf-tool/lib/styles.css')

  const extractDefault = (module) => module.default || module

  const ReactPerfTool = Loadable.Map({
    loader: {
      perf: () => import('react-addons-perf').then(extractDefault),
      Component: () => import('react-perf-tool').then(extractDefault),
    },
    loading: () => null,
    render(loaded, _props) {
      const { Component, perf } = loaded

      return (
        <Component {..._props} perf={perf} />
      )
    },
  })

  return (
    <ReactPerfTool {...props} />
  )
}
