import FetchError from '@/app/types/FetchErrors'
import EmployeesService from '@/app/services/employees/class-employees'

export default class DelEmployeesService extends EmployeesService {
  public async delEmployee(data: { id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting an employee.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delEmployeeImage(data: { id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting an employee image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delEmployeeAssignedCustomer(data: { id: number, customer_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/assigned_customers/${data.customer_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting an employee assigned customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delEmployeeEvent(data: { id: number, event_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/events/${data.event_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting an employee event.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }
}
