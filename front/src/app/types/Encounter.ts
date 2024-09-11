export type Encounter = {
  id: number
  customerId: number
  date: string
  rating: number
  comment: string
  source: string
}

export type BasicEncounter = Omit<Encounter, 'id'>

export type EncounterDTO = {
  id: number
  customerId: number
  date: string
  rating: number
}

export function isEncounter(data: unknown): data is Encounter {
  return !!data &&
    typeof (data as Encounter).id === 'number' &&
    typeof (data as Encounter).customerId === 'string' &&
    typeof (data as Encounter).date === 'string' &&
    typeof (data as Encounter).rating === 'string' &&
    typeof (data as Encounter).comment === 'string' &&
    typeof (data as Encounter).source === 'string'
}

export function isEncounterDTO(data: unknown): data is EncounterDTO {
  return !!data &&
    typeof (data as EncounterDTO).id === 'number' &&
    typeof (data as EncounterDTO).customerId === 'string' &&
    typeof (data as EncounterDTO).date === 'string' &&
    typeof (data as EncounterDTO).rating === 'number'
}

export function isEncounters(datas: unknown): datas is EncounterDTO[] {
  return Array.isArray(datas) && datas.every(data => isEncounterDTO(data))
}
