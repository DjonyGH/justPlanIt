import React from 'react'
import { observer } from 'mobx-react'
// import { useStore } from '../..'
import style from './styles.module.scss'
import { SettingOutlined } from '@ant-design/icons'
import { useHistory, useLocation } from 'react-router-dom'
import { routes } from '../../routing'
// import { useStore } from '../..'

interface IProps {}

export const Header: React.FC<IProps> = observer(() => {
  // const { appStore } = useStore()
  const location = useLocation()
  const history = useHistory()

  return (
    <div className={style.header}>
      <div className={style.menu}>
        <div
          className={`${style.menuItem} ${
            routes.tasks.path === location.pathname || routes.tasks.path === `${location.pathname}/` ? style.active : ''
          }`}
          onClick={() => history.push(routes.tasks.path)}
        >
          Задачи
        </div>
        <div
          className={`${style.menuItem} ${
            routes.goals.path === location.pathname || routes.goals.path === `${location.pathname}/` ? style.active : ''
          }`}
          onClick={() => history.push(routes.goals.path)}
        >
          Цели
        </div>
      </div>
      <div className={style.settings}>
        <SettingOutlined style={{ fontSize: '20px' }} />
      </div>
      {/* <div className={style.leftSide} onClick={() => appStore.tg?.close()}>
        {appStore.tg?.initDataUnsafe?.user?.first_name + ' ' + appStore.tg?.initDataUnsafe?.user?.last_name}
      </div>
      <div className={style.rightSide}>{appStore.tg?.initDataUnsafe?.user?.id}</div> */}
    </div>
  )
})
