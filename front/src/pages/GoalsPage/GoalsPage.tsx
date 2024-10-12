import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { userStore } = useStore()

  useEffect(() => {
    if (!userStore.user?.id) return
  }, [userStore.user?.id]) // eslint-disable-line

  return <div className={style.goalsPage}></div>
})
