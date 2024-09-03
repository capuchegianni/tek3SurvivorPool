export type Encounter = {
  id: number
  customer_id: number
  date: string
  rating: number
  comment: string
  source: string
}

export type EncounterDTO = {
  id: number
  customer_id: number
  date: string
  rating: number
}

export function isCustomer(data: unknown): data is Encounter {
  return !!data &&
    typeof (data as Encounter).id === 'number' &&
    typeof (data as Encounter).customer_id === 'string' &&
    typeof (data as Encounter).date === 'string' &&
    typeof (data as Encounter).rating === 'string' &&
    typeof (data as Encounter).comment === 'string' &&
    typeof (data as Encounter).source === 'string'
}

export function isCustomerDTO(data: unknown): data is EncounterDTO {
  return !!data &&
    typeof (data as EncounterDTO).id === 'number' &&
    typeof (data as EncounterDTO).customer_id === 'string' &&
    typeof (data as EncounterDTO).date === 'string' &&
    typeof (data as EncounterDTO).rating === 'number'
}

export function isCustomers(datas: unknown): datas is EncounterDTO[] {
  return Array.isArray(datas) && datas.every(data => isCustomerDTO(data))
}