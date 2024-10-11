import React, { useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'

import { FormInstance, Tooltip } from 'antd'
import { EMode, INewTask, ITask } from '../../types'
import { isPastDate } from '../../../../utils/utils'
import dayjs from 'dayjs'
import {
  BarsOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FastForwardOutlined,
} from '@ant-design/icons'
import { useStore } from '../../../..'

interface IProps {
  task: ITask
  form: FormInstance<INewTask>
  setIsModalOpen: (value: boolean) => void
  setIsWithoutDate: (value: boolean) => void
  setTaskId: (value: string) => void
  setMode: (value: EMode) => void
}

export const Tasks: React.FC<IProps> = observer((props) => {
  const { task, form, setIsModalOpen, setIsWithoutDate, setTaskId, setMode } = props

  const { tasksStore } = useStore()
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const onEdit = (task: ITask) => {
    setMode(EMode.Edit)
    setIsModalOpen(true)
    form.setFieldValue('title', task.title)
    form.setFieldValue('date', dayjs(task.date))
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
      setIsTooltipOpen(false)
    }
  }

  const orderDown = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, -1)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }
  const orderUp = async (id: string) => {
    const isSuccess = await tasksStore.changeOrderTask(id, 1)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }
  const toNextDay = async (id: string) => {
    const isSuccess = await tasksStore.sendToNextDay(id)
    isSuccess && tasksStore.fetchTasks()
    setIsTooltipOpen(false)
  }

  return (
    <div className={style.task} key={task.id}>
      <div className={style.checkbox} onClick={() => onChange(task, !task.isDone)}>
        {!task.isDone && !isPastDate(task.date) && <div className={style.empty} />}
        {!task.isDone && isPastDate(task.date) && <CloseOutlined style={{ color: 'var(--red)', fontSize: '18px' }} />}
        {!!task.isDone && <CheckOutlined style={{ color: 'var(--green)', fontSize: '18px' }} />}
      </div>

      <div className={style.title}>{task.title}</div>
      {!isPastDate(task.date) && (
        <div className={style.edit}>
          <Tooltip
            placement='bottomLeft'
            fresh
            mouseLeaveDelay={0}
            open={isTooltipOpen}
            title={
              <div className={style.controls}>
                <CaretUpOutlined
                  style={{ color: 'var(--gray)', fontSize: '20px' }}
                  onClick={() => orderDown(task.id)}
                />
                <CaretDownOutlined
                  style={{ color: 'var(--gray)', fontSize: '20px' }}
                  onClick={() => orderUp(task.id)}
                />
                <FastForwardOutlined
                  style={{ color: 'var(--gray)', fontSize: '20px' }}
                  onClick={() => toNextDay(task.id)}
                />
                <EditOutlined style={{ color: 'var(--gray)', fontSize: '20px' }} onClick={() => onEdit(task)} />
                <DeleteOutlined style={{ color: 'var(--red)', fontSize: '20px' }} onClick={() => removeTask(task.id)} />
              </div>
            }
          >
            <BarsOutlined style={{ fontSize: '16px' }} onClick={() => setIsTooltipOpen(true)} />
          </Tooltip>
        </div>
      )}
    </div>
  )
})
