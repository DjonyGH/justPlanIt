import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { useStore } from '../../../..'
import { CloseOutlined } from '@ant-design/icons'

interface IProps {
  goalId: string | undefined
  isModalOpen: boolean
  setIsModalOpen: (value: boolean) => void
}

export const TaskList: React.FC<IProps> = observer((props) => {
  const { goalId, isModalOpen, setIsModalOpen } = props

  const { goalsStore } = useStore()

  useEffect(() => {}, [])

  const onSubmit = async () => {}

  return (
    <>
      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.header}>
            Список задач
            <div onClick={() => setIsModalOpen(false)}>
              <CloseOutlined style={{ color: 'var(--white)', fontSize: '18px' }} />
            </div>
          </div>

          <div className={style.body}></div>
        </div>
      )}
    </>
  )
})
