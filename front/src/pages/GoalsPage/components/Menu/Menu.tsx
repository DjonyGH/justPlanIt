import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { Button } from '../../../../components/Button/Button'
import { PlusOutlined } from '@ant-design/icons'
import { useStore } from '../../../..'
import { ETab } from '../../GoalsPage'
import { IGoal } from '../../types'

interface IProps {
  tab: ETab
  setIsModalOpen: (value: boolean) => void
  setSelectedGoal: (value: IGoal | undefined) => void
  setTab: (value: ETab) => void
}

export const Menu: React.FC<IProps> = observer((props) => {
  const { tab, setIsModalOpen, setSelectedGoal, setTab } = props

  const { tasksStore } = useStore()

  const onCreate = () => {
    tasksStore.setExpanded(null)
    setIsModalOpen(true)
    setSelectedGoal(undefined)
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
          text='Прошедшие'
          size='min'
          type={tab === ETab.Past ? 'primary' : 'default'}
          onClick={() => onTabClick(ETab.Past)}
        />
      </div>
      <Button text={() => <PlusOutlined />} type='primary' size='square' onClick={onCreate} />
    </div>
  )
})
