import React from 'react'
import { observer } from 'mobx-react'
// import { useStore } from '../..'
import style from './styles.module.scss'
import { useStore } from '../..'

interface IProps {}

export const Header: React.FC<IProps> = observer(() => {
  const { appStore } = useStore()

  return (
    <div className={style.header}>
      <div className={style.leftSide} onClick={() => appStore.tg?.close()}>
        {appStore.tg?.initDataUnsafe?.user?.first_name + ' ' + appStore.tg?.initDataUnsafe?.user?.last_name}
      </div>
      <div className={style.rightSide}>{appStore.tg?.initDataUnsafe?.user?.id}</div>
    </div>
  )
})
