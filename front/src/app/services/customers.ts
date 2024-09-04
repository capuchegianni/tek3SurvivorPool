import { Clothe, isClothes } from "@/app/types/Clothe"
import {
  Customer,
  CustomerDTO,
  isCustomer,
  isCustomers
} from "@/app/types/Customer"
import { Payment, isPaymentHistory } from "@/app/types/PaymentHistory"

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
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
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
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
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
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json() as { image: string }
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
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
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
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isClothes(object))
      throw new Error(`An error happened when fetching customer ${data.id} clothes list.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}