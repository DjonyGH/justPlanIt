import React, { useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { IGoal } from '../../types'
import { isPastGoal } from '../../../../utils/utils'
import {
  BarsOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { useStore } from '../../../..'
import { TaskList } from '../TaskList/TaskList'

interface IProps {
  goal: IGoal
  setIsModalOpen: (value: boolean) => void
  setSelectedGoal: (value: IGoal) => void
}

export const Goal: React.FC<IProps> = observer((props) => {
  const { goal, setIsModalOpen, setSelectedGoal } = props

  const { goalsStore } = useStore()

  const [isTaskListOpen, setIsTaskListOpen] = useState(false)

  const onEdit = (goal: IGoal) => {
    setSelectedGoal(goal)
    setIsModalOpen(true)
  }

  const onComplete = async (goal: IGoal, isDone: boolean) => {
    await goalsStore.completeGoal(goal.id, isDone)
    const goals = [...goalsStore.goals]
    const newGoal = goals.find((i) => i.id === goal.id)
    if (newGoal) {
      newGoal.isDone = isDone
    }
    goalsStore.setGoals(goals)
  }

  const onRemove = async (id: string) => {
    const isSucces = await goalsStore.removeGoal(id)
    if (isSucces) {
      const goals = goalsStore.goals.filter((i) => i.id !== id)
      goalsStore.setGoals(goals)
      goalsStore.setExpanded(null)
    }
  }

  return (
    <>
      <div className={`${style.goal}`}>
        <div className={style.checkbox} onClick={() => onComplete(goal, !goal.isDone)}>
          {!goal.isDone && !isPastGoal(goal.date) && <div className={style.empty} />}
          {!goal.isDone && isPastGoal(goal.date) && <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />}
          {!!goal.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
        </div>

        <div className={style.title} onClick={() => goalsStore.setExpanded(null)}>
          {goal.title}
        </div>

        <div className={style.edit}>
          <div className={`${style.controls} ${!!goalsStore.expanded[goal.id] ? style.expandedThreeItems : ''}`}>
            <BarsOutlined
              style={{ color: 'var(--gray)', fontSize: '20px' }}
              onClick={() => {
                setIsTaskListOpen(true)
                goalsStore.setExpanded(null)
              }}
            />

            <EditOutlined style={{ color: 'var(--gray)', fontSize: '20px' }} onClick={() => onEdit(goal)} />
            <DeleteOutlined style={{ color: 'var(--red)', fontSize: '20px' }} onClick={() => onRemove(goal.id)} />
          </div>

          <MoreOutlined
            style={{ fontSize: '18px', marginRight: '-5px' }}
            onClick={(e) => {
              goalsStore.setExpanded(goal.id)
              e.stopPropagation()
            }}
          />
        </div>
      </div>
      <TaskList goalId={goal.id} isOpen={isTaskListOpen} setIsOpen={setIsTaskListOpen} />
    </>
  )
})
