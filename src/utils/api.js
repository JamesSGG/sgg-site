
import { getIsDev } from './env'

const { SGG_API_URL, SGG_API_WEB_SOCKETS_URL } = process.env

const isDev = getIsDev()

export function getApiUrl() {
  if (SGG_API_URL) {
    return SGG_API_URL
  }

  if (isDev) {
    return 'http://localhost:8880'
  }

  return 'https://social-gaming-guild-api.herokuapp.com'
}

export function getApiWebSocketsUrl() {
  if (SGG_API_WEB_SOCKETS_URL) {
    return SGG_API_WEB_SOCKETS_URL
  }

  if (isDev) {
    return 'ws://localhost:5000'
  }

  return 'ws://social-gaming-guild-api.herokuapp.com:5000'
}
