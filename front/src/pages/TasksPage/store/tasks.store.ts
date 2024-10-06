import { action, makeObservable, observable } from 'mobx'
import { RootStore } from '../../../stores/root.store'
// import { mockData1 } from '../mocks/data'
// import http from '../../../services/http.service'

export interface ITasksStore {}

export default class TasksStore implements ITasksStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this, {})
  }

  clear() {}
}
