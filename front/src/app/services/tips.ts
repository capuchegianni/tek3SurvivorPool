import { Tip, isTips } from "@/app/types/Tip"
import FetchError from '@/app/types/FetchErrors'

export default class TipsService {
  private _route = 'http://localhost:5000/api/tips'
  private _headers = {
      'Content-Type': 'application/json'
  }

  public async getTips(): Promise<Tip[]> {
    const res = await fetch(this._route, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()
    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching tips.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isTips(object))
      throw new Error('An error happened when fetching tips.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}