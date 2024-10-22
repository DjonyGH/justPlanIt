import { makeAutoObservable } from 'mobx'
import { RootStore } from '../../../stores/root.store'
import { INewTask, ITask, TExpanded } from '../types'
import http from '../../../services/http.service'
import { getCurrentDateUTC, isCurrentDate, isFutureDate, isPastDate } from '../../../utils/utils'

export interface ITasksStore {
  tasks: ITask[]
  expanded: TExpanded
  currentTasks: ITask[][]
  futureTasks: ITask[][]
  tasksWithoutDate: ITask[]
  setTasks: (data: ITask[]) => void
  setExpanded: (value: string | null) => void
  fetchTasks: (goalId?: string) => Promise<void>
  completeTasks: (taskId: string, isDone: boolean) => Promise<void>
  changeOrderTask: (taskId: string, changeOrder: 1 | -1) => Promise<boolean | undefined>
  sendToNextDay: (taskId: string) => Promise<boolean | undefined>
  sendToCurrentDay: (taskId: string) => Promise<boolean | undefined>
  createTask: (newTask: INewTask) => Promise<ITask | undefined>
  updateTask: (taskId: string, newTask: INewTask) => Promise<ITask | undefined>
  removeTask: (taskId: string) => Promise<boolean | undefined>
}

export default class TasksStore implements ITasksStore {
  tasks: ITask[] = []
  expanded: TExpanded = {}

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)
  }

  setTasks(data: ITask[]) {
    this.tasks = data
  }

  setExpanded(value: string | null) {
    if (!value) this.expanded = {}
    else this.expanded = { [value]: true }
  }

  async fetchTasks(goalId?: string) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let tasks: ITask[] = await http.get<ITask[]>(`/tasks?${goalId ? 'goalId=' + goalId : ''}`)
      this.setTasks(tasks.map((i) => ({ ...i, id: i._id })))
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async completeTasks(taskId: string, isDone: boolean) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.put<ITask>(`/tasks/${taskId}/complete`, { isDone })
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async changeOrderTask(taskId: string, changeOrder: 1 | -1) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.put<ITask>(`/tasks/${taskId}/order`, { changeOrder })
      return true
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async sendToNextDay(taskId: string) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.put<ITask>(`/tasks/${taskId}/next-day`, {})
      return true
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async sendToCurrentDay(taskId: string) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.put<ITask>(`/tasks/${taskId}/current-day`, {
        currentDate: getCurrentDateUTC(),
      })
      return true
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async createTask(newTask: INewTask) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let createdTask: ITask = await http.post<ITask>(`/tasks`, newTask)

      return {
        ...createdTask,
        id: createdTask._id,
      }
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async updateTask(taskId: string, newTask: INewTask) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let updatedTask: ITask = await http.put<ITask>(`/tasks/${taskId}`, newTask)
      return {
        ...updatedTask,
        id: updatedTask._id,
      }
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async removeTask(id: string) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.delete<ITask>(`/tasks/${id}`)
      return true
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  get currentTasks() {
    const tasks: Record<string, ITask[]> = this.tasks
      .filter((i) => !!i.date && (isCurrentDate(i.date) || isPastDate(i.date)))
      .reduce((acc, i) => {
        if (!(i.date in acc)) {
          acc[i.date] = []
        }
        acc[i.date].push(i)
        return acc
      }, {} as Record<string, ITask[]>)

    return Object.keys(tasks)
      .sort((a, b) => Date.parse(b) - Date.parse(a))
      .map((key) => tasks[key])
  }

  get futureTasks() {
    const tasks: Record<string, ITask[]> = this.tasks
      .filter((i) => !!i.date && isFutureDate(i.date))
      .reduce((acc, i) => {
        if (!(i.date in acc)) {
          acc[i.date] = []
        }
        acc[i.date].push(i)
        return acc
      }, {} as Record<string, ITask[]>)

    return Object.keys(tasks)
      .sort((a, b) => Date.parse(b) - Date.parse(a))
      .map((key) => tasks[key])
  }

  get tasksWithoutDate() {
    return this.tasks.filter((i) => !i.date)
  }

  clear() {}
}
