import { makeObservable, observable } from 'mobx'

export interface ILoaderStore {
  isLoading: boolean
  setIsLoading: (data: boolean) => void
}

export class LoaderStore implements ILoaderStore {
  isLoading: boolean = false

  constructor() {
    makeObservable(this, {
      isLoading: observable,
    })
  }

  setIsLoading(data: boolean) {
    this.isLoading = data
  }
}
