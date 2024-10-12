import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Form } from 'antd'
import { EMode, INewGoal } from './types'
import { Menu } from './components/Menu/Menu'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { userStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [goalId, setGoalId] = useState<string | undefined>()
  const [form] = Form.useForm<INewGoal>()

  useEffect(() => {
    if (!userStore.user?.id) return
  }, [userStore.user?.id]) // eslint-disable-line

  return (
    <div className={style.goalsPage}>
      <Menu form={form} setIsModalOpen={setIsModalOpen} setMode={setMode} setGoalId={setGoalId} />
    </div>
  )
})