import { action, makeObservable, observable } from 'mobx'

export interface IAppStore {
  isSidebarCollapsed: boolean
  title: string
  toggleIsSidebarCollapsed: () => void
  setTitle: (data: string) => void
  tg: WebApp | null
  setTg: (data: WebApp) => void
}

export class AppStore implements IAppStore {
  isSidebarCollapsed: boolean = false
  title: string = 'Panda games'
  tg: WebApp | null = null

  constructor() {
    makeObservable(this, {
      isSidebarCollapsed: observable,
      tg: observable,
      title: observable,
      toggleIsSidebarCollapsed: action,
      setTitle: action,
      setTg: action,
    })
  }

  toggleIsSidebarCollapsed() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed
  }

  setTitle(data: string) {
    this.title = data
  }

  setTg(data: WebApp) {
    this.tg = data
  }
}
