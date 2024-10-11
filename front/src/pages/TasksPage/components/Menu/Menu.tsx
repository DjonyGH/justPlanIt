import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { EMode, INewTask } from '../../types'
import { Button } from '../../../../components/Button/Button'
import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { ETab } from '../../TasksPage'

interface IProps {
  tab: ETab
  form: FormInstance<INewTask>
  setIsModalOpen: (value: boolean) => void
  setTaskId: (value: string | undefined) => void
  setMode: (value: EMode) => void
  setTab: (value: ETab) => void
}

export const Menu: React.FC<IProps> = observer((props) => {
  const { tab, form, setIsModalOpen, setTaskId, setMode, setTab } = props

  const onCreate = () => {
    setMode(EMode.Create)
    setIsModalOpen(true)
    form.resetFields()
    setTaskId(undefined)
  }

  return (
    <div className={style.menu}>
      <div className={style.leftSide}>
        <Button
          text='Текущие'
          size='min'
          type={tab === ETab.Current ? 'primary' : 'default'}
          onClick={() => setTab(ETab.Current)}
        />
        <Button
          text='Будущие'
          size='min'
          type={tab === ETab.Future ? 'primary' : 'default'}
          onClick={() => setTab(ETab.Future)}
        />
        <Button
          text='Без даты'
          size='min'
          type={tab === ETab.WithoutDate ? 'primary' : 'default'}
          onClick={() => setTab(ETab.WithoutDate)}
        />
      </div>
      <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
    </div>
  )
})