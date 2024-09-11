import { Clothe, BasicClothe, isClothe } from "@/app/types/Clothe"
import { Customer, BasicCustomer, isCustomer } from "@/app/types/Customer"
import { Encounter, BasicEncounter, isEncounter } from "@/app/types/Encounter"
import { Payment, BasicPayment, isPayment } from "@/app/types/PaymentHistory"
import FetchError from '@/app/types/FetchErrors'
import CustomersService from '@/app/services/customers/class-customers'

export default class PostCustomersService extends CustomersService {
  public async postCustomer(data: BasicCustomer): Promise<Customer> {
    const res = await fetch(this._route, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isCustomer(object))
      throw new Error('An error happened when posting a customer.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async postCustomerImage(data: { id: number, image: string }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.image)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when posting a customer image.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async postCustomerPayment(data: { id: number, payment: BasicPayment }): Promise<Payment> {
    const res = await fetch(`${this._route}/${data.id}/payments_history`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.payment)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer payment.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isPayment(object))
      throw new Error('An error happened when posting a customer payment.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async postCustomerClothe(data: { id: number, clothe: BasicClothe }): Promise<Clothe> {
    const res = await fetch(`${this._route}/${data.id}/clothes`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.clothe)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isClothe(object))
      throw new Error('An error happened when posting a customer clothe.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async postCustomerSavedClothe(data: { id: number, clothe_id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/saved_clothes`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.clothe_id)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer saved clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when posting a customer saved clothe.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async postCustomerEncounter(data: { id: number, encounter: BasicEncounter }): Promise<Encounter> {
    const res = await fetch(`${this._route}/${data.id}/encounters`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.encounter)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a customer encounter.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEncounter(object))
      throw new Error('An error happened when posting a customer encounter.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
