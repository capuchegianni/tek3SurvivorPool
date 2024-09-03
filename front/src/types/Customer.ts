export type Customer = {
  id: number
  email: string
  name: string
  surname: string
  birth_date: string
  gender: string
  description: string
  astroligical_sign: string
}

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
    typeof (data as Customer).birth_date === 'string' &&
    typeof (data as Customer).gender === 'string' &&
    typeof (data as Customer).description === 'string' &&
    typeof (data as Customer).astroligical_sign === 'string'
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
