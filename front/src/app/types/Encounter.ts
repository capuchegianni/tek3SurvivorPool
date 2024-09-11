export type Encounter = {
  id: number
  customer_id: number
  date: string
  rating: number
  comment: string
  source: string
}

export type BasicEncounter = Omit<Encounter, 'id'>

export function isEncounter(data: unknown): data is Encounter {
  return !!data &&
    typeof (data as Encounter).id === 'number' &&
    typeof (data as Encounter).customer_id === 'string' &&
    typeof (data as Encounter).date === 'string' &&
    typeof (data as Encounter).rating === 'string' &&
    typeof (data as Encounter).comment === 'string' &&
    typeof (data as Encounter).source === 'string'
}

export function isEncounters(datas: unknown): datas is Encounter[] {
  return Array.isArray(datas) && datas.every(data => isEncounter(data))
}
