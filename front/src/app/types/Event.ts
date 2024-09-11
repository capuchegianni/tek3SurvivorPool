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

export function isEvents(datas: unknown): datas is Event[] {
  return Array.isArray(datas) && datas.every(data => isEvent(data))
}
