import { Clothe, BasicClothe, isClothe } from "@/app/types/Clothe"
import { Customer, BasicCustomer, isCustomer } from "@/app/types/Customer"
import { Encounter, BasicEncounter, isEncounter } from "@/app/types/Encounter"
import { Payment, BasicPayment, isPayment } from "@/app/types/PaymentHistory"
import FetchError from '@/app/types/FetchErrors'
import CustomersService from '@/app/services/customers/class-customers'

export default class PutCustomersService extends CustomersService {
  public async putCustomer(data: { id: number, customer: Partial<BasicCustomer> }): Promise<Customer> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.customer)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a customer.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isCustomer(object))
      throw new Error('An error happened when putting a customer.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async putCustomerImage(data: { id: number, image: string }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.image)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a customer image.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!object || typeof object.details !== 'string')
      throw new Error('An error happened when putting a customer image.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object.details
  }

  public async putCustomerPayment(data: { id: number, payment_id: number, payment: Partial<BasicPayment> }): Promise<Payment> {
    const res = await fetch(`${this._route}/${data.id}/payments_history/${data.payment_id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.payment)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a customer payment.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isPayment(object))
      throw new Error('An error happened when putting a customer payment.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async putCustomerClothe(data: { id: number, clothe_id: number, clothe: Partial<BasicClothe> }): Promise<Clothe> {
    const res = await fetch(`${this._route}/${data.id}/clothes/${data.clothe_id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.clothe)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a customer clothe.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isClothe(object))
      throw new Error('An error happened when putting a customer clothe.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async putCustomerEncounter(data: { id: number, encounter_id: number, encounter: Partial<BasicEncounter> }): Promise<Encounter> {
    const res = await fetch(`${this._route}/${data.id}/encounters/${data.encounter_id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.encounter)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a customer encounter.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isEncounter(object))
      throw new Error('An error happened when putting a customer encounter.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
