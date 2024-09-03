import { Clothe, isClothes } from "@/types/clothe"
import {
    Customer,
    CustomerDTO,
    isCustomer,
    isCustomers
} from "@/types/customer"
import { Payment, isPaymentHistory } from "@/types/paymentHistory"

export default class CustomersService {
    private _route = 'https://localhost:5000/api/customers'
    private _headers = {
        'Content-Type': 'application/json'
    }

    public async getCustomers(): Promise<CustomerDTO[]> {
        const res = await fetch(this._route, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isCustomers(object))
            throw new Error('An error happened when fetching customers.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getCustomer(data: { id: string }): Promise<Customer> {
        const res = await fetch(`${this._route}/${data.id}`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isCustomer(object))
            throw new Error(`An error happened when fetching customer ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getCustomerImage(data: { id: string }): Promise<string> {
        const res = await fetch(`${this._route}/${data.id}/image`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        return await res.json()
    }

    public async getCustomerPaymentsHistory(data: { id: string }): Promise<Payment[]> {
        const res = await fetch(`${this._route}/${data.id}/payments_history`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isPaymentHistory(object))
            throw new Error(`An error happened when fetching customer ${data.id} payments history.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getCustomerClothes(data: { id: string }): Promise<Clothe[]> {
        const res = await fetch(`${this._route}/${data.id}/clothes`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isClothes(object))
            throw new Error(`An error happened when fetching customer ${data.id} clothes list.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }
}