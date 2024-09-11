import { Employee, BasicEmployee, isEmployee } from '@/app/types/Employee'
import { BasicEvent, Event, isEvent } from '@/app/types/Event'
import FetchError from '@/app/types/FetchErrors'
import EmployeesService from '@/app/services/employees/class-employees'

export default class PutEmployeesService extends EmployeesService {
  public async putEmployee(data: { id: number, employee: Partial<BasicEmployee> }): Promise<Employee> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.employee)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting an employee.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEmployee(object))
      throw new Error('An error happened when putting an employee.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async putEmployeeImage(data: { id: number, image: string }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.image)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting an employee image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when putting an employee image.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async putEmployeeEvent(data: { id: number, event_id: number, event: Partial<BasicEvent> }): Promise<Event> {
    const res = await fetch(`${this._route}/${data.id}/events/${data.event_id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.event)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting an employee event.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEvent(object))
      throw new Error('An error happened when putting an employee event.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
