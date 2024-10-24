import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { ITask } from '../../types'
import { isCurrentDate, isPastDate } from '../../../../utils/utils'
import {
  MoreOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FastForwardOutlined,
  PullRequestOutlined,
  AimOutlined,
} from '@ant-design/icons'
import { useStore } from '../../../..'

interface IProps {
  task: ITask
  setIsModalOpen: (value: boolean) => void
  setSelectedTask: (value: ITask) => void
  isFirst?: boolean
  isLast?: boolean
  isGoalTask?: boolean
}

export const Task: React.FC<IProps> = observer((props) => {
  const { task, setIsModalOpen, setSelectedTask, isFirst, isLast, isGoalTask } = props

  const { tasksStore, goalTasksStore } = useStore()

  const store = isGoalTask ? goalTasksStore : tasksStore

  const onEdit = (task: ITask) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const onChange = async (task: ITask, isDone: boolean) => {
    await store.completeTasks(task.id, isDone)
    const tasks = [...store.tasks]
    const newTask = tasks.find((i) => i.id === task.id)
    if (newTask) {
      newTask.isDone = isDone
    }
    store.setTasks(tasks)
  }

  const removeTask = async (id: string) => {
    const isSucces = await store.removeTask(id)
    if (isSucces) {
      const tasks = store.tasks.filter((i) => i.id !== id)
      store.setTasks(tasks)
      store.setExpanded(null)
    }
  }

  const orderDown = async (id: string) => {
    const isSuccess = await store.changeOrderTask(id, -1)
    isSuccess && store.fetchTasks()
  }
  const orderUp = async (id: string) => {
    const isSuccess = await store.changeOrderTask(id, 1)
    isSuccess && store.fetchTasks()
  }
  const toCurrentDay = async (id: string) => {
    const isSuccess = await store.sendToCurrentDay(id)
    isSuccess && store.fetchTasks()
  }
  const toNextDay = async (id: string) => {
    const isSuccess = await store.sendToNextDay(id)
    isSuccess && store.fetchTasks()
  }

  return (
    <div className={`${style.task}`}>
      <div className={style.checkbox} onClick={() => onChange(task, !task.isDone)}>
        {!task.isDone && !isPastDate(task.date) && <div className={style.empty} />}
        {!task.isDone && isPastDate(task.date) && <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />}
        {!!task.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
      </div>

      <div className={style.title} onClick={() => store.setExpanded(null)}>
        {!!task.isImportant && (
          <ExclamationCircleOutlined style={{ color: 'var(--red)', fontSize: '14px', marginRight: '5px' }} />
        )}{' '}
        {!!task.goalId && <AimOutlined style={{ color: 'var(--blue)', fontSize: '14px', marginRight: '5px' }} />}{' '}
        {task.title}
      </div>

      <div className={style.edit}>
        <div
          className={`${style.controls} ${
            !!store.expanded[task.id] ? (isGoalTask ? style.expanded3Items : style.expanded5Items) : ''
          }`}
        >
          {!isGoalTask && (
            <CaretUpOutlined
              style={{ color: 'var(--gray)', fontSize: '22px' }}
              className={`${isFirst ? style.disabled : ''}`}
              onClick={() => !isFirst && orderDown(task.id)}
            />
          )}
          {!isGoalTask && (
            <CaretDownOutlined
              style={{ color: 'var(--gray)', fontSize: '22px' }}
              className={`${isLast ? style.disabled : ''}`}
              onClick={() => !isLast && orderUp(task.id)}
            />
          )}
          {(!isCurrentDate(task.date) || !task.date) && (
            <PullRequestOutlined
              style={{ color: 'var(--gray)', fontSize: '22px' }}
              onClick={() => toCurrentDay(task.id)}
            />
          )}
          {!isGoalTask && (isCurrentDate(task.date) || !task.date) && (
            <FastForwardOutlined
              style={{ color: 'var(--gray)', fontSize: '22px' }}
              onClick={() => toNextDay(task.id)}
            />
          )}
          <EditOutlined style={{ color: 'var(--gray)', fontSize: '20px' }} onClick={() => onEdit(task)} />
          <DeleteOutlined style={{ color: 'var(--red)', fontSize: '20px' }} onClick={() => removeTask(task.id)} />
        </div>

        <MoreOutlined
          style={{ fontSize: '18px', marginRight: '-5px' }}
          onClick={(e) => {
            store.setExpanded(task.id)
            e.stopPropagation()
          }}
        />
      </div>
    </div>
  )
})
