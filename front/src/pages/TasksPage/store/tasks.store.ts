import { makeAutoObservable } from 'mobx'
import { RootStore } from '../../../stores/root.store'
import { ITask } from '../types'
// import { mockData1 } from '../mocks/data'
import http from '../../../services/http.service'

export interface ITasksStore {
  tasks: ITask[]
  groupedTasks: ITask[][]
  fetchTasks: () => Promise<void>
}

export default class TasksStore implements ITasksStore {
  tasks: ITask[] = []

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)
  }

  setTasks(data: ITask[]) {
    this.tasks = data
  }

  async fetchTasks() {
    try {
      this.rootStore.loaderStore.setIsLoading(true)
      let tasks: ITask[] = await http.get<ITask[]>(`/tasks`)
      this.setTasks(tasks)
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  get groupedTasks() {
    const tasks: Record<string, ITask[]> = this.tasks.reduce((acc, i) => {
      if (!(i.date in acc)) {
        acc[i.date] = []
      }
      acc[i.date].push(i)
      return acc
    }, {} as Record<string, ITask[]>)

    // console.log('groupedTasks', tasks)

    return Object.values(tasks)
  }

  clear() {}
}
