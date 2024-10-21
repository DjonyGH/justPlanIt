import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { FormInstance } from 'antd'
import { EMode, INewTask, ITask } from '../../types'
import { isCurrentDate, isPastDate } from '../../../../utils/utils'
import dayjs from 'dayjs'
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
} from '@ant-design/icons'
import { useStore } from '../../../..'

interface IProps {
  task: ITask
  form: FormInstance<INewTask>
  setIsModalOpen: (value: boolean) => void
  setIsWithoutDate: (value: boolean) => void
  setTaskId: (value: string) => void
  setMode: (value: EMode) => void
  isFirst?: boolean
  isLast?: boolean
}

export const Tasks: React.FC<IProps> = observer((props) => {
  const { task, form, setIsModalOpen, setIsWithoutDate, setTaskId, setMode, isFirst, isLast } = props

  const { tasksStore } = useStore()

  const onEdit = (task: ITask) => {
    setMode(EMode.Edit)
    setIsModalOpen(true)
    form.setFieldValue('title', task.title)
    form.setFieldValue('date', dayjs(task.date))
    form.setFieldValue('isImportant', task.isImportant)
    setIsWithoutDate(!task.date)
    setTaskId(task.id)
  }

  const onChange = async (task: ITask, isDone: boolean) => {
    await tasksStore.completeTasks(task.id, isDone)
    const tasks = [...tasksStore.tasks]
    const newTask = tasks.find((i) => i.id === task.id)
    if (newTask) {
      newTask.isDone = isDone
    }
    tasksStore.setTasks(tasks)
  }

  const removeTask = async (id: string) => {
    const isSucces = await tasksStore.removeTask(id)
    if (isSucces) {
      const tasks = tasksStore.tasks.filter((i) => i.id !== id)
      tasksStore.setTasks(tasks)
      tasksStore.setExpanded(null)
    }
  }

  const orderDown = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, -1)
    isSuccess && tasksStore.fetchTasks()
  }
  const orderUp = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, 1)
    isSuccess && tasksStore.fetchTasks()
  }
  const toCurrentDay = async (id: string) => {
    const isSuccess = await tasksStore.sendToCurrentDay(id)
    isSuccess && tasksStore.fetchTasks()
  }
  const toNextDay = async (id: string) => {
    const isSuccess = await tasksStore.sendToNextDay(id)
    isSuccess && tasksStore.fetchTasks()
  }

  return (
    <div className={`${style.task}`}>
      <div className={style.checkbox} onClick={() => onChange(task, !task.isDone)}>
        {!task.isDone && !isPastDate(task.date) && <div className={style.empty} />}
        {!task.isDone && isPastDate(task.date) && <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />}
        {!!task.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
      </div>

      <div className={style.title} onClick={() => tasksStore.setExpanded(null)}>
        {!!task.isImportant && (
          <ExclamationCircleOutlined style={{ color: 'var(--red)', fontSize: '14px', marginRight: '5px' }} />
        )}{' '}
        {task.title}
      </div>

      <div className={style.edit}>
        <div className={`${style.controls} ${!!tasksStore.expanded[task.id] ? style.expanded : ''}`}>
          <CaretUpOutlined
            style={{ color: 'var(--gray)', fontSize: '22px' }}
            className={`${isFirst ? style.disabled : ''}`}
            onClick={() => !isFirst && orderDown(task.id)}
          />
          <CaretDownOutlined
            style={{ color: 'var(--gray)', fontSize: '22px' }}
            className={`${isLast ? style.disabled : ''}`}
            onClick={() => !isLast && orderUp(task.id)}
          />
          {(!isCurrentDate(task.date) || !task.date) && (
            <PullRequestOutlined
              style={{ color: 'var(--gray)', fontSize: '22px' }}
              onClick={() => toCurrentDay(task.id)}
            />
          )}
          {(isCurrentDate(task.date) || !task.date) && (
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
            tasksStore.setExpanded(task.id)
            e.stopPropagation()
          }}
        />
      </div>
    </div>
  )
})
