import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/reset.scss'
import './index.scss'
import './assets/styles/colors.scss'
import './assets/styles/antTable.scss'
import './assets/styles/antOthers.scss'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { RootStore } from './stores/root.store'

const store = new RootStore()
const AppContext = React.createContext(store)
export const useStore = () => React.useContext(AppContext)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <AppContext.Provider value={store}>
      <App />
    </AppContext.Provider>
  </BrowserRouter>
)
