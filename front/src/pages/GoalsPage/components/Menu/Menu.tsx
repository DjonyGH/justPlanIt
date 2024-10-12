import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { EMode, INewGoal } from '../../types'
import { Button } from '../../../../components/Button/Button'
import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { useStore } from '../../../..'

interface IProps {
  form: FormInstance<INewGoal>
  setIsModalOpen: (value: boolean) => void
  setGoalId: (value: string | undefined) => void
  setMode: (value: EMode) => void
}

export const Menu: React.FC<IProps> = observer((props) => {
  const { form, setIsModalOpen, setGoalId, setMode } = props

  const { tasksStore } = useStore()

  const onCreate = () => {
    tasksStore.setExpanded(null)
    setMode(EMode.Create)
    setIsModalOpen(true)
    form.resetFields()
    setGoalId(undefined)
  }

  return (
    <div className={style.menu}>
      <div className={style.leftSide}></div>
      <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
    </div>
  )
})
