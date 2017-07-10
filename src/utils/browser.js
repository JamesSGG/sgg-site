// @fow

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

  if (window.devicePixelRatio > 1.25) {
    return true
  }

  const mediaQuery = [
    '(-webkit-min-device-pixel-ratio: 1.25)',
    '(min--moz-device-pixel-ratio: 1.25)',
    '(-o-min-device-pixel-ratio: 5/4)',
    '(min-resolution: 1.25dppx)',
  ].join(', ')

  if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
    return true
  }

  return false
}
