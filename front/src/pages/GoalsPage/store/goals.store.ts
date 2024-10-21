import { makeAutoObservable } from 'mobx'
import { RootStore } from '../../../stores/root.store'
import { IGoal, INewGoal, TExpanded } from '../types'
import http from '../../../services/http.service'
import { isPastGoal } from '../../../utils/utils'
import moment from 'moment'

export interface IGoalsStore {
  goals: IGoal[]
  expanded: TExpanded
  currentGoals: IGoal[][]
  pastGoals: IGoal[][]
  // futureTasks: ITask[][]
  // tasksWithoutDate: ITask[]
  setGoals: (data: IGoal[]) => void
  setExpanded: (value: string | null) => void
  fetchGoals: () => Promise<void>
  completeGoal: (goalId: string, isDone: boolean) => Promise<void>
  // changeOrderTask: (taskId: string, changeOrder: 1 | -1) => Promise<boolean | undefined>
  // sendToNextDay: (taskId: string) => Promise<boolean | undefined>
  // sendToCurrentDay: (taskId: string) => Promise<boolean | undefined>
  createGoal: (newGoal: INewGoal) => Promise<IGoal | undefined>
  updateGoal: (goalId: string, newGoal: INewGoal) => Promise<IGoal | undefined>
  removeGoal: (goalId: string) => Promise<boolean | undefined>
}

export default class GoalsStore implements IGoalsStore {
  goals: IGoal[] = []
  expanded: TExpanded = {}

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this)
  }

  setGoals(data: IGoal[]) {
    this.goals = data
  }

  setExpanded(value: string | null) {
    if (!value) this.expanded = {}
    else this.expanded = { [value]: true }
  }

  async fetchGoals() {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let goals: IGoal[] = await http.get<IGoal[]>(`/goals`)
      this.setGoals(goals.map((i) => ({ ...i, id: i._id })))
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async completeGoal(goalId: string, isDone: boolean) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.put<IGoal>(`/goals/${goalId}/complete`, { isDone })
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async createGoal(newGoal: INewGoal) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      console.log('newGoal', newGoal)
      let createdGoal: IGoal = await http.post<IGoal>(`/goals`, newGoal)
      console.log('newTask', createdGoal)
      return {
        ...createdGoal,
        id: createdGoal._id,
      }
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async updateGoal(goalId: string, newGoal: INewGoal) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      let updatedGoal: IGoal = await http.put<IGoal>(`/goals/${goalId}`, newGoal)
      return {
        ...updatedGoal,
        id: updatedGoal._id,
      }
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async removeGoal(id: string) {
    try {
      // this.rootStore.loaderStore.setIsLoading(true)
      await http.delete<IGoal>(`/goals/${id}`)
      return true
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      // this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  get currentGoals() {
    const goals: Record<string, IGoal[]> = this.goals
      .filter((i) => !isPastGoal(i.date))
      .reduce((acc, i) => {
        if (!(i.date in acc)) {
          acc[i.date] = []
        }
        acc[i.date].push(i)
        return acc
      }, {} as Record<string, IGoal[]>)

    return Object.keys(goals)
      .sort((a, b) => {
        let dateA
        let dateB
        if (a.length <= 4) {
          dateA = moment(a).add(1, 'y').add(-1, 's')
        } else if (a.length <= 7) {
          dateA = moment(a).add(1, 'M').add(-1, 's')
        } else {
          dateA = moment(a)
        }
        if (b.length <= 4) {
          dateB = moment(b).add(1, 'y').add(-1, 's')
        } else if (b.length <= 7) {
          dateB = moment(b).add(1, 'M').add(-1, 's')
        } else {
          dateB = moment(b)
        }
        return dateA > dateB ? 1 : -1
      })
      .map((key) => goals[key])
  }

  get pastGoals() {
    const tasks: Record<string, IGoal[]> = this.goals
      .filter((i) => isPastGoal(i.date))
      .reduce((acc, i) => {
        if (!(i.date in acc)) {
          acc[i.date] = []
        }
        acc[i.date].push(i)
        return acc
      }, {} as Record<string, IGoal[]>)

    return Object.keys(tasks)
      .sort((a, b) => {
        return moment(a) < moment(b) ? 1 : -1
      })
      .map((key) => tasks[key])
  }

  // get futureTasks() {
  //   const tasks: Record<string, ITask[]> = this.tasks
  //     .filter((i) => !!i.date && isFutureDate(i.date))
  //     .reduce((acc, i) => {
  //       if (!(i.date in acc)) {
  //         acc[i.date] = []
  //       }
  //       acc[i.date].push(i)
  //       return acc
  //     }, {} as Record<string, ITask[]>)

  //   return Object.keys(tasks)
  //     .sort((a, b) => Date.parse(b) - Date.parse(a))
  //     .map((key) => tasks[key])
  // }

  // get tasksWithoutDate() {
  //   return this.tasks.filter((i) => !i.date)
  // }

  clear() {}
}
