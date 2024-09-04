import { Credentials, isToken } from '@/app/types/Credentials'
import {
  EmployeeDTO,
  isEmployees,
  Employee,
  isEmployee
} from '@/app/types/Employee'
import { setAuthHeader, getAuthHeader } from './authToken'

export default class EmployeesService {
  private _route = 'http://localhost:5000/api/employees'
  private _headers = {
      'Content-Type': 'application/json',
      'Authorization': getAuthHeader()
  }

  public async getEmployees(): Promise<EmployeeDTO[]> {
    const res = await fetch(this._route, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isEmployees(object))
      throw new Error('An error happened when fetching employees.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async login(data: Credentials): Promise<boolean> {
    const res = await fetch(`${this._route}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isToken(object))
      throw Error('Couldn\'t login.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    setAuthHeader(object.token)
    this._headers['Authorization'] = `Bearer ${object.token}`
    return true
  }

  public async getEmployee(data: { id: number }): Promise<Employee> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isEmployee(object))
      throw new Error(`An error happened when fetching employee ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getEmployeeMe(): Promise<Employee> {
    const res = await fetch(`${this._route}/me`, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isEmployee(object))
      throw new Error('An error happened when fetching your account.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getEmployeeImage(data: { id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json() as { image: string }
    if (!object || typeof object.image !== 'string')
      throw Error(`An error happened when fetching the employee ${data.id} image.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.image
  }
}