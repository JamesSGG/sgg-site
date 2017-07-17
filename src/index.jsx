
import React from 'react'
import ReactDOM from 'react-dom'

import 'semantic-ui-css/semantic.css'

import AppWrapper from 'components/AppWrapper'
import App from 'components/App'

const renderApp = () => (
  <AppWrapper>
    <App />
  </AppWrapper>
)

ReactDOM.render(renderApp(), document.getElementById('root'))
