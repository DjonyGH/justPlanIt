import axios, { AxiosResponse } from 'axios'
import { action, makeObservable, observable } from 'mobx'
import http, { BASE_URL } from '../services/http.service'
import { IAuthResponce, ICheckData, IUser, IUserNew } from '../types/types'
import { RootStore } from './root.store'

export interface IUserStore {
  isAuth?: boolean
  user?: IUser
  setIsAuth: (data: boolean) => void
  setUser: (data: IUser) => void
  login: (checkData: ICheckData, userData: IUserNew) => Promise<boolean>
  fetchUser: (newUser: IUserNew) => Promise<void>
}

export default class UserStore implements IUserStore {
  isAuth?: boolean
  user?: IUser

  constructor(private rootStore: RootStore) {
    makeObservable(this, {
      isAuth: observable,
      user: observable,
      setIsAuth: action,
      setUser: action,
      fetchUser: action,
      login: action,
    })
  }

  setIsAuth(data: boolean) {
    this.isAuth = data
  }

  setUser(data: IUser | undefined) {
    this.user = data
  }

  async fetchUser(newUser: IUserNew) {
    try {
      this.rootStore.loaderStore.setIsLoading(true)
      let data: IUser = await http.post<IUser>(`/users`, newUser)
      this.setUser({
        ...data,
        //@ts-ignore
        id: data._id,
      })
      //@ts-ignore
      document.cookie = `userId=${data._id}`
      //@ts-ignore
      sessionStorage.setItem('userId', data._id)
    } catch (e: unknown) {
      console.warn(e)
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }

  async login(checkData: ICheckData, userData: IUserNew): Promise<boolean> {
    try {
      this.rootStore.loaderStore.setIsLoading(true)

      const { data } = await axios.post<any, AxiosResponse<IAuthResponce>>(`${BASE_URL}/auth`, {
        checkData,
        userData,
      })

      const { user, accessToken } = data
      localStorage.setItem('access-token', accessToken)
      this.setIsAuth(true)
      this.setUser({
        ...user,
        //@ts-ignore
        id: user._id,
      })
      return true
    } catch (error: any) {
      this.setIsAuth(false)
      return false
    } finally {
      this.rootStore.loaderStore.setIsLoading(false)
    }
  }
}
