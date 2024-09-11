import { Clothe } from "./Clothe"
import { Encounter } from "./Encounter"
import { Payment } from "./PaymentHistory"

export type Customer = {
  id: number
  email: string
  name: string
  surname: string
  birth_date: string
  gender: string
  description: string
  astrological_sign: string
  phone_number: string
  address: string
  payments_history: Payment[]
  clothes: Clothe[]
  saved_clothes: number[]
  encounters: Encounter[]
  image: string
}

export type BasicCustomer = Omit<Customer, 'id' | 'paymentsHistory' | 'clothes' | 'saved_clothes' | 'encounters' | 'image'>

export type BasicCustomerWithID = Omit<Customer, 'paymentsHistory' | 'clothes' | 'saved_clothes' | 'encounters' | 'image'>

export function isCustomer(data: unknown): data is Customer {
  return !!data &&
    typeof (data as Customer).id === 'number' &&
    typeof (data as Customer).email === 'string' &&
    typeof (data as Customer).name === 'string' &&
    typeof (data as Customer).surname === 'string' &&
    typeof (data as Customer).birth_date === 'string' &&
    typeof (data as Customer).gender === 'string' &&
    typeof (data as Customer).description === 'string' &&
    typeof (data as Customer).astrological_sign === 'string' &&
    typeof (data as Customer).phone_number === 'string' &&
    typeof (data as Customer).address === 'string'
}

export function isCustomers(datas: unknown): datas is Customer[] {
  return Array.isArray(datas) && datas.every(data => isCustomer(data))
}
