import FetchError from '@/app/types/FetchErrors'
import CustomersService from '@/app/services/customers/class-customers'

export default class DelCustomersService extends CustomersService {
  public async delCustomer(data: { id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delCustomerImage(data: { id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delCustomerPayment(data: { id: number, payment_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/payments_history/${data.payment_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer payment.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delCustomerClothe(data: { id: number, clothe_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/clothes/${data.clothe_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delCustomerSavedClothe(data: { id: number, clothe_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/saved_clothes/${data.clothe_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer saved clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }

  public async delCustomerEncounter(data: { id: number, encounter_id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}/encounters/${data.encounter_id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a customer encounter.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }
}
