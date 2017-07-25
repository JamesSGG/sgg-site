// @flow

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function isIE(): boolean {
  if (!isBrowser()) {
    return false
  }

  return /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent)
}

export function isTouch(): boolean {
  if (!isBrowser()) {
    return false
  }

  const { document, DocumentTouch, ontouchstart } = window

  return !!ontouchstart || (DocumentTouch && document instanceof DocumentTouch)
}

export function isRetina(): boolean {
  if (!isBrowser()) {
    return false
  }

  const { devicePixelRatio, matchMedia } = window

  if (devicePixelRatio && devicePixelRatio > 1.25) {
    return true
  }

  const mediaQuery = [
    '(-webkit-min-device-pixel-ratio: 1.25)',
    '(min--moz-device-pixel-ratio: 1.25)',
    '(-o-min-device-pixel-ratio: 5/4)',
    '(min-resolution: 1.25dppx)',
  ].join(', ')

  if (matchMedia && matchMedia(mediaQuery).matches) {
    return true
  }

  return false
}
