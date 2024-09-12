import { Clothe, isClothe, isClothes } from "@/app/types/Clothe"
import { BasicCustomerWithID, Customer, isCustomer, isCustomers } from "@/app/types/Customer"
import { Encounter, isEncounter, isEncounters } from "@/app/types/Encounter"
import { Payment, isPayment, isPaymentsHistory } from "@/app/types/PaymentHistory"
import FetchError from '@/app/types/FetchErrors'
import CustomersService from '@/app/services/customers/class-customers'

export default class GetCustomersService extends CustomersService {
  public async getCustomer(data: { id: number }): Promise<BasicCustomerWithID> {
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

  public async getCustomers(): Promise<Customer[]> {
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

  public async getCustomerImage(data: { id: number }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (typeof object.image !== 'string')
      throw Error(`An error happened when fetching the customer ${data.id} image.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.image
  }

  public async getCustomerPayment(data: { id: number, payment_id: number }): Promise<Payment> {
    const res = await fetch(`${this._route}/${data.id}/payments_history/${data.payment_id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer payment.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isPayment(object))
      throw new Error(`An error happened when fetching customer ${data.id} payment ${data.payment_id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
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

    if (!isPaymentsHistory(object))
      throw new Error(`An error happened when fetching customer ${data.id} payments history.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomerClothe(data: { id: number, clothe_id: number }): Promise<Clothe> {
    const res = await fetch(`${this._route}/${data.id}/clothes/${data.clothe_id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isClothe(object))
      throw new Error(`An error happened when fetching customer ${data.id} clothe ${data.clothe_id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

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

  public async getCustomerSavedClothes(data: { id: number }): Promise<number[]> {
    const res = await fetch(`${this._route}/${data.id}/saved_clothes`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer saved clothes.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!Array.isArray(object))
      throw new Error(`An error happened when fetching customer ${data.id} saved clothes list.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomerEncounter(data: { id: number, encounter_id: number }): Promise<Encounter> {
    const res = await fetch(`${this._route}/${data.id}/encounters/${data.encounter_id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer encounter.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEncounter(object))
      throw new Error(`An error happened when fetching customer ${data.id} encounter ${data.encounter_id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getCustomerEncounters(data: { id: number }): Promise<Encounter[]> {
    const res = await fetch(`${this._route}/${data.id}/encounters`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a customer encounters.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEncounters(object))
      throw new Error(`An error happened when fetching customer ${data.id} encounters list.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
