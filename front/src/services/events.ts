import {
  Event,
  EventDTO,
  isEvent,
  isEvents
} from "@/types/Event"

export default class EventsService {
  private _route = 'https://localhost:5000/api/events'
  private _headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }

  public async getEvents(): Promise<EventDTO[]> {
    const res = await fetch(this._route, {
        method: 'GET',
        headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isEvents(object))
      throw new Error('An error happened when fetching events.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }

  public async getEvent(data: { id: string }): Promise<Event> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    const object = await res.json()
    if (!isEvent(object))
      throw new Error(`An error happened when fetching event ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}