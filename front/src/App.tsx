import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import { Content } from './components/Content/Content'
import { Header } from './components/Header/Header'
import { Main } from './components/Main/Main'
import { Notification } from './components/Notification/Notification'
import { IRouteValue, routes } from './routing'
import { useStore } from '.'
import { NotFound } from './pages/NotFount/NotFound'

const tg = window.Telegram.WebApp
tg.BackButton.isVisible = true

const App: React.FC = observer(() => {
  const { userStore: store, appStore } = useStore()
  const history = useHistory()

  useEffect(() => {
    appStore.setTg(tg)
    tg.BackButton.onClick(() => history.push(routes.tasks.path))

    store.fetchUser({
      tgId: tg.initDataUnsafe?.user?.id || 12,
      userName: tg.initDataUnsafe?.user?.first_name + ' ' + tg.initDataUnsafe?.user?.last_name,
      login: tg.initDataUnsafe?.user?.username,
    })
  }, []) // eslint-disable-line

  return (
    <div className='App'>
      <Switch>
        <Route path='*'>
          <Main>
            <Header />
            <Content>
              <Switch>
                {(Object.values(routes) as IRouteValue[]).map((route) => (
                  <Route exact={route.exact} path={route.path} component={route.component} key={route.path} />
                ))}
                <Route path={'/*'} component={NotFound} />
              </Switch>
            </Content>
            <Notification />
          </Main>
        </Route>
      </Switch>
    </div>
  )
})

export default App