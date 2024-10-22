import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../..'
import { Form } from 'antd'
import { EMode, INewTask, ITask } from './types'
import { getDate, getDayName, ucFirst } from '../../utils/utils'
import { Tasks } from './components/Task/Tasks'
import { Menu } from './components/Menu/Menu'
import { Modal } from './components/Modal/Modal'

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

  const [isWithoutDate, setIsWithoutDate] = useState(false)
  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [taskId, setTaskId] = useState<string | undefined>()
  const [form] = Form.useForm<INewTask>()

  useEffect(() => {
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
    <div className={style.mainPage} onClick={(e) => tasksStore.setExpanded(null)}>
      <Menu
        tab={tab}
        form={form}
        setIsModalOpen={setIsModalOpen}
        setMode={setMode}
        setTab={setTab}
        setTaskId={setTaskId}
      />
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
                  <Tasks
                    task={task}
                    form={form}
                    setIsModalOpen={setIsModalOpen}
                    setIsWithoutDate={setIsWithoutDate}
                    setTaskId={setTaskId}
                    setMode={setMode}
                    key={task.id}
                    isFirst={!idx}
                    isLast={idx === arr.length - 1}
                  />
                ))}
            </div>
          </div>
        ))}

      {tab === ETab.WithoutDate && (
        <div className={style.taskList}>
          {tasksStore.tasksWithoutDate
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <Tasks
                task={task}
                form={form}
                setIsModalOpen={setIsModalOpen}
                setIsWithoutDate={setIsWithoutDate}
                setTaskId={setTaskId}
                setMode={setMode}
                key={task.id}
              />
            ))}
        </div>
      )}

      <Modal
        mode={mode}
        form={form}
        taskId={taskId}
        isModalOpen={isModalOpen}
        isWithoutDate={isWithoutDate}
        setIsModalOpen={setIsModalOpen}
        setIsWithoutDate={setIsWithoutDate}
      />
    </div>
  )
})
