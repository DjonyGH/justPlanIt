import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Button } from '../../../../components/Button/Button'
import { EMode, INewTask } from '../../../TasksPage/types'
import { Form } from 'antd'

interface IProps {
  goalId: string | undefined
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export const TaskList: React.FC<IProps> = observer((props) => {
  const { goalId, isOpen, setIsOpen } = props

  const { goalTasksStore } = useStore()
  const [form] = Form.useForm<INewTask>()

  const [mode, setMode] = useState<EMode>(EMode.Create)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    goalTasksStore.fetchTasks(goalId)
  }, [goalId]) // eslint-disable-line

  const onCreate = () => {
    goalTasksStore.setExpanded(null)
    setMode(EMode.Create)
    setIsModalOpen(true)
    form.resetFields()
  }

  return (
    <>
      {isOpen && (
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
          </div>
        </div>
      )}
    </>
  )
})
