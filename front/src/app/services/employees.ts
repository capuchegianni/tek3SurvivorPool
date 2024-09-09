import { Credentials } from '@/app/types/Credentials'
import {
  EmployeeDTO,
  isEmployees,
  Employee,
  isEmployee
} from '@/app/types/Employee'
import FetchError from '@/app/types/FetchErrors'

export default class EmployeesService {
  private _route = 'http://localhost:5000/api/employees'
  private _headers = {
      'Content-Type': 'application/json'
  }

  public async getEmployees(): Promise<EmployeeDTO[]> {
    const res = await fetch(this._route, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = (await res.json())
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching employees.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEmployees(object))
      throw new Error('An error happened when fetching employees.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async login(data: Credentials): Promise<string> {
    if (!data.email || !data.password)
      throw Error('Please provide an email and a password.')

    const res = await fetch(`${this._route}/login`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data),
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured during login.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    return object.details
  }

  public async logout(): Promise<string> {
    const res = await fetch(`${this._route}/logout`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured during logout.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    return object.details
  }

  public async isConnected(data: { token: string } | null): Promise<{ details: string, isConnected: boolean}> {
    const res = await fetch(`${this._route}/is_connected`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': data ? `Bearer ${data.token}` : ''
      },
      credentials: 'include'
    })
    const object = await res.json()

    return { details: object.details, isConnected: res.ok }
  }

  public async getEmployeeMe(): Promise<Employee> {
    const res = await fetch(`${this._route}/me`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching an employee.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEmployee(object))
      throw new Error('An error happened when fetching your account.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getEmployee(data: { id: number }): Promise<Employee> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching an employee.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEmployee(object))
      throw new Error(`An error happened when fetching employee ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getEmployeeImage(data: { id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json() as { image: string } & { details: string }
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching an employee image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.image !== 'string')
      throw Error(`An error happened when fetching the employee ${data.id} image.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.image
  }

  public async getEmployeePermissions(): Promise<{ details: string, code: number }> {
    const res = await fetch(`${this._route}/has_permissions/Admin`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const jsonObject = await res.json()

    return { details: jsonObject.details, code: res.status }
  }
}