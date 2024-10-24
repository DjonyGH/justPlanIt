import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { ITask } from '../../types'
import { Button } from '../../../../components/Button/Button'
import { PlusOutlined } from '@ant-design/icons'
import { ETab } from '../../TasksPage'
import { useStore } from '../../../..'

interface IProps {
  tab: ETab
  setIsModalOpen: (value: boolean) => void
  setSelectedTask: (value: ITask | undefined) => void
  setTab: (value: ETab) => void
}

export const Menu: React.FC<IProps> = observer((props) => {
  const { tab, setIsModalOpen, setSelectedTask, setTab } = props

  const { tasksStore } = useStore()

  const onCreate = () => {
    tasksStore.setExpanded(null)
    setIsModalOpen(true)
    setSelectedTask(undefined)
  }

  const onTabClick = (value: ETab) => {
    tasksStore.setExpanded(null)
    setTab(value)
  }

  return (
    <div className={style.menu}>
      <div className={style.leftSide}>
        <Button
          text='Текущие'
          size='min'
          type={tab === ETab.Current ? 'primary' : 'default'}
          onClick={() => onTabClick(ETab.Current)}
        />
        <Button
          text='Будущие'
          size='min'
          type={tab === ETab.Future ? 'primary' : 'default'}
          onClick={() => onTabClick(ETab.Future)}
        />
        <Button
          text='Без даты'
          size='min'
          type={tab === ETab.WithoutDate ? 'primary' : 'default'}
          onClick={() => onTabClick(ETab.WithoutDate)}
        />
      </div>
      <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
    </div>
  )
})
