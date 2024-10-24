import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { IGoal } from './types'
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
  const [selectedGoal, setSelectedGoal] = useState<IGoal | undefined>()

  useEffect(() => {
    if (!userStore.user?.id) return
    goalsStore.fetchGoals()

    return () => {
      goalsStore.setExpanded(null)
    }
  }, [userStore.user?.id]) // eslint-disable-line

  const groupedGoals: Record<ETab, IGoal[][]> = {
    [ETab.Current]: goalsStore.currentGoals,
    [ETab.Past]: goalsStore.pastGoals,
  }

  return (
    <div className={style.goalsPage}>
      <Menu tab={tab} setIsModalOpen={setIsModalOpen} setSelectedGoal={setSelectedGoal} setTab={setTab} />

      {groupedGoals[tab].map((i) => (
        <div className={style.goalListWrapper} key={i[0].date}>
          <div className={style.date}>{getDate(i[0].date)}</div>
          <div className={style.goalList}>
            {i.map((goal) => (
              <Goal goal={goal} setIsModalOpen={setIsModalOpen} setSelectedGoal={setSelectedGoal} key={goal.id} />
            ))}
          </div>
        </div>
      ))}

      <Modal goal={selectedGoal} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
})
