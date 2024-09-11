import { Clothe } from "./Clothe"
import { Encounter } from "./Encounter"
import { Payment } from "./PaymentHistory"

export type Customer = {
  id: number
  email: string
  name: string
  surname: string
  birthDate: string
  gender: string
  description: string
  astrologicalSign: string
  phoneNumber: string
  address: string
  paymentsHistory: Payment[]
  clothes: Clothe[]
  savedClothes: number[]
  encounters: Encounter[]
  image: string
}

export type BasicCustomer = Omit<Customer, 'id' | 'paymentsHistory' | 'clothes' | 'saved_clothes' | 'encounters' | 'image'>

export type BasicCustomerWithID = Omit<Customer, 'paymentsHistory' | 'clothes' | 'saved_clothes' | 'encounters' | 'image'>

export type CustomerDTO = {
  id: number
  email: string
  name: string
  surname: string
}

export function isCustomer(data: unknown): data is Customer {
  return !!data &&
    typeof (data as Customer).id === 'number' &&
    typeof (data as Customer).email === 'string' &&
    typeof (data as Customer).name === 'string' &&
    typeof (data as Customer).surname === 'string' &&
    typeof (data as Customer).birthDate === 'string' &&
    typeof (data as Customer).gender === 'string' &&
    typeof (data as Customer).description === 'string' &&
    typeof (data as Customer).astrologicalSign === 'string' &&
    typeof (data as Customer).phoneNumber === 'string' &&
    typeof (data as Customer).address === 'string'
}

export function isCustomerDTO(data: unknown): data is CustomerDTO {
  return !!data &&
    typeof (data as CustomerDTO).id === 'number' &&
    typeof (data as CustomerDTO).email === 'string' &&
    typeof (data as CustomerDTO).name === 'string' &&
    typeof (data as CustomerDTO).surname === 'string'
}

export function isCustomers(datas: unknown): datas is CustomerDTO[] {
  return Array.isArray(datas) && datas.every(data => isCustomerDTO(data))
}
