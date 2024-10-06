import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
// import { useHistory } from 'react-router-dom'
import { TextItem } from '../../components/TextItem/TextItem'
import style from './styles.module.scss'

// import { routes } from '../../routing'
import { useStore } from '../..'

interface IProps {}

export const TasksPage: React.FC<IProps> = observer(() => {
  console.log('MainPage')

  const { tasksStore, userStore } = useStore()
  // const history = useHistory()

  useEffect(() => {}, [userStore.user?.id]) // eslint-disable-line

  return (
    <div className={style.mainPage}>
      <div className={style.info}>
        <TextItem label='Лига' text={userStore.user?.liga || '---'} />
        <TextItem label='Очки' text='105.1' />
        {/* <TextItem label='Очки' text={userStore.user?.id || '---'} /> */}
        <TextItem label='Место' text='17' />
        {/* <TextItem label='Место' text={store.userTournaments[0]?.id} />   */}
      </div>

      <div className={style.logo}></div>

      {/* <div className={style.menu}>
        <div className={style.menuItem} onClick={() => history.push(routes.rating.path)}>
          <div className={style.menuLogo}>
            <TrophyOutlined />
          </div>
          <div className={style.menuText}>Рейтинг</div>
        </div>

        <div className={style.menuItem} onClick={() => history.push(routes.friends.path)}>
          <div className={style.menuLogo}>
            <TeamOutlined />
          </div>
          <div className={style.menuText}>Друзья</div>
        </div>

        <div className={style.menuItem} onClick={() => console.log('menuItem')}>
          <div className={style.menuLogo}>
            <SketchOutlined />
          </div>
          <div className={style.menuText}>Призы</div>
        </div>

        <div className={style.menuItem} onClick={() => history.push(routes.history.path)}>
          <div className={style.menuLogo}>
            <HourglassOutlined />
          </div>
          <div className={style.menuText}>История</div>
        </div>

        <div className={style.menuItem} onClick={() => console.log('menuItem')}>
          <div className={style.menuLogo}>
            <QuestionCircleOutlined />
          </div>
          <div className={style.menuText}>FAQ</div>
        </div>
      </div> */}
    </div>
  )
})
