import { EventEmitter } from 'events'

// Global singleton event emitter to survive dynamic bundler hot-reloads in development
const globalEvents = global as unknown as {
  notificationEmitter?: EventEmitter
}

if (!globalEvents.notificationEmitter) {
  globalEvents.notificationEmitter = new EventEmitter()
  // Allow high volume of concurrent admin sessions
  globalEvents.notificationEmitter.setMaxListeners(200)
}

export const notificationEmitter = globalEvents.notificationEmitter
