import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { FormInstance } from 'antd'
import { EMode, IGoal, IGoalForm } from '../../types'
import { isPastGoal } from '../../../../utils/utils'
import { BarsOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
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
    setTaskId(goal.id)
  }

  const onComplete = async (goal: IGoal, isDone: boolean) => {
    // await goalsStore.completeTasks(goal.id, isDone)
    // const goals = [...goalsStore.goals]
    // const newTask = goals.find((i) => i.id === goal.id)
    // if (newTask) {
    //   newTask.isDone = isDone
    // }
    // goalsStore.setTasks(goals)
  }

  const onRemove = async (id: string) => {
    // const isSucces = await goalsStore.removeTask(id)
    // if (isSucces) {
    //   const goals = goalsStore.goals.filter((i) => i.id !== id)
    //   goalsStore.setTasks(goals)
    //   goalsStore.setExpanded(null)
    // }
  }

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
        <div className={`${style.controls} ${!!goalsStore.expanded[goal.id] ? style.expanded : ''}`}>
          <EditOutlined style={{ color: 'var(--gray)', fontSize: '20px' }} onClick={() => onEdit(goal)} />
          <DeleteOutlined style={{ color: 'var(--red)', fontSize: '20px' }} onClick={() => onRemove(goal.id)} />
        </div>

        <BarsOutlined
          style={{ fontSize: '18px' }}
          onClick={(e) => {
            goalsStore.setExpanded(goal.id)
            e.stopPropagation()
          }}
        />
      </div>
    </div>
  )
})
