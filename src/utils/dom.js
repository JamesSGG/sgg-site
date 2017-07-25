// @flow

import { isBrowser } from './browser'


/**
 * Returns the root element for the current page.
 */
export function getRootElement(): ?HTMLElement {
  if (!isBrowser()) {
    return null
  }

  const { documentElement, body } = window.document

  return documentElement || body
}
