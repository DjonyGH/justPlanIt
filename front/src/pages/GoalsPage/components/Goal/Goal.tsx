import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { FormInstance } from 'antd'
import { EMode, IGoal, IGoalForm } from '../../types'
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

interface IProps {
  goal: IGoal
  form: FormInstance<IGoalForm>
  setIsModalOpen: (value: boolean) => void
  setTaskId: (value: string) => void
  setMode: (value: EMode) => void
}

export const Goal: React.FC<IProps> = observer((props) => {
  const { goal, form, setIsModalOpen, setTaskId, setMode } = props

  const { goalsStore } = useStore()

  const onEdit = (goal: IGoal) => {
    setMode(EMode.Edit)
    setIsModalOpen(true)
    form.setFieldValue('title', goal.title)
    form.setFieldValue('year', goal.date.substring(0, 4))
    form.setFieldValue('month', goal.date.substring(5, 7))
    form.setFieldValue('day', goal.date.substring(8, 10))
    setTaskId(goal.id)
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

  const onAddTasks = async (id: string) => {}

  return (
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
          <BarsOutlined style={{ color: 'var(--gray)', fontSize: '20px' }} onClick={() => onAddTasks(goal.id)} />

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
  )
})
