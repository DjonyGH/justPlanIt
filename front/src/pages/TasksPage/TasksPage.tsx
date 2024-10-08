import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Checkbox } from 'antd'
import { ITask } from './types'
import { getDate, getDayName } from '../../utils/utils'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { tasksStore, userStore } = useStore()

  useEffect(() => {
    if (!userStore.user?.id) return
    tasksStore.fetchTasks()
  }, [userStore.user?.id]) // eslint-disable-line

  const onChange = async (task: ITask, isDone: boolean) => {
    await tasksStore.completeTasks(task.id, isDone)
    const tasks = [...tasksStore.tasks]
    const newTask = tasks.find((i) => i.id === task.id)
    if (newTask) {
      newTask.isDone = isDone
    }
    tasksStore.setTasks(tasks)
  }

  return (
    <div className={style.mainPage}>
      {tasksStore.groupedTasks.map((i) => (
        <div className={style.day} key={i[0].date}>
          <div className={style.date}>
            {getDate(i[0].date)} ({getDayName(i[0].date)})
          </div>
          <div className={style.taskList}>
            {i.map((task) => (
              <div className={style.task} key={task.id}>
                <Checkbox onChange={(e) => onChange(task, e.target.checked)} checked={task.isDone} />
                <div className={style.title}>{task.title}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})
