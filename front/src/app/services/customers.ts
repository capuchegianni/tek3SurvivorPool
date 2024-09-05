import { Clothe, isClothes } from "@/app/types/Clothe"
import {
  Customer,
  CustomerDTO,
  isCustomer,
  isCustomers
} from "@/app/types/Customer"
import { Payment, isPaymentHistory } from "@/app/types/PaymentHistory"

class FetchError extends Error {
  status: number
  statusText: string
  details: string | null

  constructor(data: { message: string, status: number, statusText: string, details: string | null }) {
    super(data.message)
    this.status = data.status
    this.statusText = data.statusText
    this.details = data.details
    this.name = 'FetchError'
  }
}

export default class CustomersService {
  private _route = 'http://localhost:5000/api/customers'
  private _headers = {
    'Content-Type': 'application/json'
  }

  public async getCustomers(): Promise<CustomerDTO[]> {
    const res = await fetch(this._route, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching customers.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isCustomers(object))
      throw new Error('An error happened when fetching customers.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomer(data: { id: number }): Promise<Customer> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isCustomer(object))
      throw new Error(`An error happened when fetching customer ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomerImage(data: { id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json() as { image: string } & { details: string }
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.image !== 'string')
      throw Error(`An error happened when fetching the customer ${data.id} image.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.image
  }

  public async getCustomerPaymentsHistory(data: { id: number }): Promise<Payment[]> {
    const res = await fetch(`${this._route}/${data.id}/payments_history`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer payments history.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isPaymentHistory(object))
      throw new Error(`An error happened when fetching customer ${data.id} payments history.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomerClothes(data: { id: number }): Promise<Clothe[]> {
    const res = await fetch(`${this._route}/${data.id}/clothes`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer clothes.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isClothes(object))
      throw new Error(`An error happened when fetching customer ${data.id} clothes list.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}