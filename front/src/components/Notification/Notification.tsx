import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { notification } from 'antd'
import { ILoggerMsg } from '../../stores/logger.store'
import { useStore } from '../..'

interface IProps {}

export const Notification: React.FC<IProps> = observer(() => {
  const { loggerStore } = useStore()

  const [api, contextHolder] = notification.useNotification()
  const prevMsgRef: React.MutableRefObject<ILoggerMsg | null> = useRef<ILoggerMsg | null>(null)

  prevMsgRef.current = loggerStore.lastMessage

  useEffect(() => {
    if (loggerStore.lastMessage && prevMsgRef.current) {
      api[loggerStore.lastMessage.type]({
        message: loggerStore.lastMessage?.type,
        description: loggerStore.lastMessage?.text || '',
        onClose: () => loggerStore.deleteFirstNotification(),
      })
    }
  }, [loggerStore.lastMessage]) //eslint-disable-line

  return <>{contextHolder}</>
})
