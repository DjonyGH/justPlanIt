import { makeObservable } from 'mobx'
import { AppStore, IAppStore } from './app.store'
import { ILoaderStore, LoaderStore } from './loader.store'
import { ILoggerStore, LoggerStore } from './logger.store'
import UserStore, { IUserStore } from './user.store'
import TasksStore, { ITasksStore } from '../pages/TasksPage/store/tasks.store'

export class RootStore {
  appStore: IAppStore
  loaderStore: ILoaderStore
  loggerStore: ILoggerStore
  userStore: IUserStore
  tasksStore: ITasksStore

  constructor() {
    makeObservable(this, {})
    this.appStore = new AppStore()
    this.loaderStore = new LoaderStore()
    this.loggerStore = new LoggerStore()
    this.userStore = new UserStore(this)
    this.tasksStore = new TasksStore(this)
  }
}
