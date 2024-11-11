import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { ITask } from './types'
import { getDate, getDayName, ucFirst } from '../../utils/utils'
import { Task } from './components/Task/Task'
import { Menu } from './components/Menu/Menu'
import { TaskModal } from './components/TaskModal/TaskModal'

export enum ETab {
  Current,
  Future,
  WithoutDate,
}

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  const { tasksStore, userStore } = useStore()
  const [tab, setTab] = useState<ETab>(ETab.Current)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedTask, setSelectedTask] = useState<ITask | undefined>()

  useEffect(() => {
    console.log('TasksPage useEffect', userStore.user?.id)
    if (!userStore.user?.id) return
    tasksStore.fetchTasks()

    return () => {
      tasksStore.setExpanded(null)
    }
  }, [userStore.user?.id]) // eslint-disable-line

  const groupedTasks: Record<ETab.Current | ETab.Future, ITask[][]> = {
    [ETab.Current]: tasksStore.currentTasks,
    [ETab.Future]: tasksStore.futureTasks,
  }

  return (
    <div className={style.taskPage} onClick={(e) => tasksStore.setExpanded(null)}>
      <Menu tab={tab} setIsModalOpen={setIsModalOpen} setTab={setTab} setSelectedTask={setSelectedTask} />
      <div className={style.content}>
        {tab !== ETab.WithoutDate &&
          groupedTasks[tab].map((i) => (
            <div className={style.day} key={i[0].date}>
              <div className={style.date}>
                {getDate(i[0].date)} {ucFirst(getDayName(i[0].date))}
              </div>
              <div className={style.taskList}>
                {i
                  .sort((a, b) => a.order - b.order)
                  .map((task, idx, arr) => (
                    <Task
                      task={task}
                      setIsModalOpen={setIsModalOpen}
                      setSelectedTask={setSelectedTask}
                      key={task.id}
                      isFirst={!idx}
                      isLast={idx === arr.length - 1}
                    />
                  ))}
              </div>
            </div>
          ))}

        {tab === ETab.WithoutDate && !!tasksStore.tasksWithoutDate.length && (
          <div className={style.taskList}>
            {tasksStore.tasksWithoutDate
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <Task task={task} setIsModalOpen={setIsModalOpen} setSelectedTask={setSelectedTask} key={task.id} />
              ))}
          </div>
        )}
      </div>

      <TaskModal task={selectedTask} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  )
})
