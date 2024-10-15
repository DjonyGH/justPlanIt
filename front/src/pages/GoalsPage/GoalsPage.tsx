import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Form } from 'antd'
import { EMode, IGoalForm } from './types'
import { Menu } from './components/Menu/Menu'
import { Modal } from './components/Modal/Modal'

interface IProps {}

export const GoalsPage: React.FC<IProps> = observer(() => {
  const { userStore } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [goalId, setGoalId] = useState<string | undefined>()
  const [form] = Form.useForm<IGoalForm>()

  useEffect(() => {
    if (!userStore.user?.id) return
  }, [userStore.user?.id]) // eslint-disable-line

  return (
    <div className={style.goalsPage}>
      <Menu form={form} setIsModalOpen={setIsModalOpen} setMode={setMode} setGoalId={setGoalId} />

      <Modal mode={mode} form={form} goalId={goalId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
})
