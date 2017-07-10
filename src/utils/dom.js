// @flow

import { isBrowser } from './browser'

/**
 * Returns true if an HTML element is passed in; false if not.
 */
export function isHtmlElement(element: mixed): boolean {
  return Boolean(element && element.nodeType)
}

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
