import { makeAutoObservable } from 'mobx'

export interface ILoaderStore {
  isLoading: boolean
  setIsLoading: (data: boolean) => void
}

export class LoaderStore implements ILoaderStore {
  isLoading: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  setIsLoading(data: boolean) {
    this.isLoading = data
  }
}
