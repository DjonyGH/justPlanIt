import { action, computed, makeObservable, observable } from 'mobx'

export enum ELoggerMsgType {
  info = 'info',
  success = 'success',
  error = 'error',
}

export interface ILoggerMsg {
  text: string
  type: ELoggerMsgType
}

export interface ILoggerStore {
  lastMessage: ILoggerMsg | null
  addNotification: (message: ILoggerMsg) => void
  deleteFirstNotification: () => void
}

export class LoggerStore implements ILoggerStore {
  messages: ILoggerMsg[] = []

  constructor() {
    makeObservable(this, {
      messages: observable,
      addNotification: action,
      deleteFirstNotification: action,
      lastMessage: computed,
    })
  }

  get lastMessage(): ILoggerMsg | null {
    const messages = this.messages
    if (messages.length) {
      return messages[messages.length - 1]
    }
    return null
  }

  addNotification(data: ILoggerMsg) {
    this.messages = [...this.messages, data]
  }

  deleteFirstNotification() {
    if (this.messages.length) {
      const messages = [...this.messages]
      messages.shift()
      this.messages = messages
    }
  }

  clear() {
    this.messages = []
  }
}
