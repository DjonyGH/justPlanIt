import { makeAutoObservable } from 'mobx'
import { RootStore } from '../../../stores/root.store'
import { ITask } from '../types'
import http from '../../../services/http.service'

export interface ITasksStore {
  tasks: ITask[]
  groupedTasks: ITask[][]
  setTasks: (data: ITask[]) => void
  fetchTasks: () => Promise<void>
  completeTasks: (taskId: string, isDone: boolean) => Promise<void>
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
      this.setTasks(tasks.map((i) => ({ ...i, id: i._id })))
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async completeTasks(taskId: string, isDone: boolean) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let newTask: ITask = await http.put<ITask>(`/tasks/${taskId}`, { isDone })
      console.log('newTask', newTask)
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
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

    return Object.values(tasks)
  }

  clear() {}
}
