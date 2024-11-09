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
import sha256 from 'crypto-js/sha256'
import { HmacSHA256 } from 'crypto-js'

const token = '7049203455:AAGv_Kj2-E2nAsAq_tR9b4Ipt5ru-1h4_9c'

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

  const tgParams = new URLSearchParams(tg.initData)
  const hash = tgParams.get('hash')
  tgParams.delete('hash')

  tgParams.sort()

  let dataCheckString = ''

  for (const [key, value] of tgParams.entries()) {
    dataCheckString += key + '=' + value + '\n'
  }

  dataCheckString = dataCheckString.slice(0, -1)

  // const dataUrl = [dataCheckString, hash]

  const secretKey = HmacSHA256(token, 'WebAppData')
  const check = HmacSHA256(dataCheckString, secretKey).toString()
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
              {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%', wordBreak: 'break-all' }}>
                {hash === check ? 'true' : 'false'}
              </div> */}
            </Content>
            <Notification />
          </Main>
        </Route>
      </Switch>
    </div>
  )
})

export default App
