import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Form } from 'antd'
import { EMode, IGoal, IGoalForm } from './types'
import { Menu } from './components/Menu/Menu'
import { Modal } from './components/Modal/Modal'
import { getDate } from '../../utils/utils'
import { Goal } from './components/Goal/Goal'

export enum ETab {
  Current,
  Past,
}

interface IProps {}

export const GoalsPage: React.FC<IProps> = observer(() => {
  const { userStore, goalsStore } = useStore()
  const [tab, setTab] = useState<ETab>(ETab.Current)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [goalId, setGoalId] = useState<string | undefined>()
  const [form] = Form.useForm<IGoalForm>()

  useEffect(() => {
    if (!userStore.user?.id) return
    goalsStore.fetchGoals()
  }, [userStore.user?.id]) // eslint-disable-line

  const groupedGoals: Record<ETab, IGoal[][]> = {
    [ETab.Current]: goalsStore.currentGoals,
    [ETab.Past]: goalsStore.pastGoals,
  }

  return (
    <div className={style.goalsPage}>
      <Menu
        form={form}
        tab={tab}
        setIsModalOpen={setIsModalOpen}
        setMode={setMode}
        setGoalId={setGoalId}
        setTab={setTab}
      />

      {groupedGoals[tab]
        // .sort((a, b) => (a[0].date > b[0].date ? 1 : -1))
        .map((i) => (
          <div className={style.goalListWrapper} key={i[0].date}>
            <div className={style.date}>{getDate(i[0].date)}</div>
            <div className={style.goalList}>
              {i.map((goal) => (
                <Goal
                  goal={goal}
                  form={form}
                  setIsModalOpen={setIsModalOpen}
                  setTaskId={setGoalId}
                  setMode={setMode}
                  key={goal.id}
                />
              ))}
            </div>
          </div>
        ))}

      <Modal mode={mode} form={form} goalId={goalId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
})
