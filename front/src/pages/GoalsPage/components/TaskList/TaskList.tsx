import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from '../../../../components/Button/Button'
import { ITask } from '../../../TasksPage/types'
import { Task } from '../../../TasksPage/components/Task/Task'
import { Modal } from '../../../TasksPage/components/Modal/Modal'

interface IProps {
  goalId: string | undefined
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export const TaskList: React.FC<IProps> = observer((props) => {
  const { goalId, isOpen, setIsOpen } = props

  const { goalTasksStore } = useStore()

  const [selectedTask, setSelectedTask] = useState<ITask | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const load = async () => {
    if (!isOpen) return
    setIsLoading(true)
    await goalTasksStore.fetchTasks(goalId)
    setIsLoading(false)
  }

  useEffect(() => {
    load()
  }, [goalId, isOpen]) // eslint-disable-line

  const onCreate = () => {
    setSelectedTask(undefined)
    goalTasksStore.setExpanded(null)
    setIsModalOpen(true)
  }

  return (
    <>
      {isOpen && (
        <>
          <div className={style.modal}>
            <div className={style.header}>
              Список задач
              <div onClick={() => setIsOpen(false)}>
                <CloseOutlined style={{ color: 'var(--white)', fontSize: '18px' }} />
              </div>
            </div>

            <div className={style.body}>
              <div className={style.menu}>
                <div className={style.leftSide}></div>
                <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
              </div>

              {!isLoading && (
                <div className={style.taskList}>
                  {goalTasksStore.tasks.map((task) => (
                    <Task
                      task={task}
                      setIsModalOpen={setIsModalOpen}
                      setSelectedTask={setSelectedTask}
                      isGoalTask
                      key={task.id}
                    />
                  ))}
                  {!goalTasksStore.tasks.length && (
                    <div className={style.noTasks}>Задачи для данной цели отсутствуют</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <Modal task={selectedTask} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </>
      )}
    </>
  )
})
