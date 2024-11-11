import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { IHttpService } from '../types/types'

export const BASE_URL = process.env.REACT_APP_BASE_URL

class HttpService implements IHttpService {
  http: AxiosInstance

  constructor() {
    this.http = axios.create({
      baseURL: BASE_URL,
    })

    this.http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.headers && (config.headers.Authorization = `Bearer ${localStorage.getItem('access-token')}`)
      return config
    })
  }

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.http.get<T>(url)
      if (data) return data
      throw new Error('data not found')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async post<T, D = any>(url: string, newData?: D): Promise<T> {
    try {
      const { data } = await this.http.post<T, AxiosResponse<T>, D>(url, newData)
      if (data) return data
      throw new Error('error of creating')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async put<T, D = any>(url: string, updData: D): Promise<T> {
    try {
      const { data } = await this.http.put<T, AxiosResponse<T>, D>(url, updData)
      if (data) return data
      throw new Error('error of updating')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const { data } = await this.http.delete<T, AxiosResponse<T>>(url)
      if (data) return data
      throw new Error('error of deleting')
    } catch (error) {
      throw new Error(`${error}`)
    }
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new HttpService()
