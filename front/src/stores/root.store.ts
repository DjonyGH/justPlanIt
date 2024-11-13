import { makeObservable } from 'mobx'
import { AppStore, IAppStore } from './app.store'
import { ILoaderStore, LoaderStore } from './loader.store'
import { ILoggerStore, LoggerStore } from './logger.store'
import UserStore, { IUserStore } from './user.store'
import TasksStore, { ITasksStore } from '../pages/TasksPage/store/tasks.store'
import GoalsStore, { IGoalsStore } from '../pages/GoalsPage/store/goals.store'

export class RootStore {
  appStore: IAppStore
  loaderStore: ILoaderStore
  loggerStore: ILoggerStore
  userStore: IUserStore
  tasksStore: ITasksStore
  goalsStore: IGoalsStore

  constructor() {
    makeObservable(this, {})
    this.appStore = new AppStore()
    this.loaderStore = new LoaderStore()
    this.loggerStore = new LoggerStore()
    this.userStore = new UserStore(this)
    this.tasksStore = new TasksStore(this)
    this.goalsStore = new GoalsStore(this)
  }
}
