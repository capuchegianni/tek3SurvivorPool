import { Employee, BasicEmployee, isEmployee } from '@/app/types/Employee'
import { BasicEvent, Event, isEvent } from '@/app/types/Event'
import FetchError from '@/app/types/FetchErrors'
import EmployeesService from '@/app/services/employees/class-employees'

export default class PostEmployeesService extends EmployeesService {
  public async postEmployee(data: BasicEmployee): Promise<Employee> {
    const res = await fetch(this._route, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting an employee.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEmployee(object))
      throw new Error('An error happened when posting an employee.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async postEmployeeImage(data: { id: number, image: string }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.image)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting an employee image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when posting an employee image.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async postEmployeeAssignedCustomer(data: { id: number, customer_id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/assigned_customers`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.customer_id)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting an employee assigned customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when posting an employee assigned customer.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async postEmployeeEvent(data: { id: number, event: BasicEvent }): Promise<Event> {
    const res = await fetch(`${this._route}/${data.id}/events`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.event)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting an employee event.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEvent(object))
      throw new Error('An error happened when posting an employee event.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
