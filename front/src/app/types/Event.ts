export type Event = {
  id: number
  name: string
  date: string
  duration: number
  max_participants: number
  location_x: string
  location_y: string
  type: string
  employee_id: number
  location_name: string
}

export type BasicEvent = Omit<Event, 'id'>

export type EventDTO = {
  id: number
  name: string
  date: string
  max_participants: number
}

export function isEvent(data: unknown): data is Event {
  return !!data &&
    typeof (data as Event).id === 'number' &&
    typeof (data as Event).name === 'string' &&
    typeof (data as Event).date === 'string' &&
    typeof (data as Event).duration == 'number' &&
    typeof (data as Event).max_participants === 'number' &&
    typeof (data as Event).location_x === 'string' &&
    typeof (data as Event).location_y === 'string' &&
    typeof (data as Event).type === 'string' &&
    typeof (data as Event).employee_id === 'number' &&
    typeof (data as Event).location_name === 'string'
}

export function isEventDTO(data: unknown): data is EventDTO {
  return !!data &&
    typeof (data as EventDTO).id === 'number' &&
    typeof (data as EventDTO).name === 'string' &&
    typeof (data as EventDTO).date === 'string' &&
    typeof (data as EventDTO).max_participants === 'string'
}

export function isEvents(datas: unknown): datas is EventDTO[] {
  return Array.isArray(datas) && datas.every(data => isEventDTO(data))
}
