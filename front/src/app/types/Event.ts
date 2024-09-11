export type Event = {
  id: number
  name: string
  date: string
  duration: number
  maxParticipants: number
  locationX: string
  locationY: string
  type: string
  employee_id: number
  locationName: string
}

export type BasicEvent = Omit<Event, 'id'>

export type EventDTO = {
  id: number
  name: string
  date: string
  maxParticipants: number
}

export function isEvent(data: unknown): data is Event {
  return !!data &&
    typeof (data as Event).id === 'number' &&
    typeof (data as Event).name === 'string' &&
    typeof (data as Event).date === 'string' &&
    typeof (data as Event).duration == 'number' &&
    typeof (data as Event).maxParticipants === 'number' &&
    typeof (data as Event).locationX === 'string' &&
    typeof (data as Event).locationY === 'string' &&
    typeof (data as Event).type === 'string' &&
    typeof (data as Event).employee_id === 'number' &&
    typeof (data as Event).locationName === 'string'
}

export function isEventDTO(data: unknown): data is EventDTO {
  return !!data &&
    typeof (data as EventDTO).id === 'number' &&
    typeof (data as EventDTO).name === 'string' &&
    typeof (data as EventDTO).date === 'string' &&
    typeof (data as EventDTO).maxParticipants === 'string'
}

export function isEvents(datas: unknown): datas is EventDTO[] {
  return Array.isArray(datas) && datas.every(data => isEventDTO(data))
}
