import React from 'react'
import { observer } from 'mobx-react'
import style from './styles.module.scss'
import { EMode, IGoalForm } from '../../types'
import { Button } from '../../../../components/Button/Button'
import { PlusOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { useStore } from '../../../..'
import { ETab } from '../../GoalsPage'

interface IProps {
  form: FormInstance<IGoalForm>
  tab: ETab
  setIsModalOpen: (value: boolean) => void
  setGoalId: (value: string | undefined) => void
  setMode: (value: EMode) => void
  setTab: (value: ETab) => void
}

export const Menu: React.FC<IProps> = observer((props) => {
  const { form, tab, setIsModalOpen, setGoalId, setMode, setTab } = props

  const { tasksStore } = useStore()

  const onCreate = () => {
    tasksStore.setExpanded(null)
    setMode(EMode.Create)
    setIsModalOpen(true)
    form.resetFields()
    setGoalId(undefined)
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
