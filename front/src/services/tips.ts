import { Tip, isTips } from "@/types/Tip"

export default class TipsService {
  private _route = 'https://localhost:5000/api/tips'
  private _headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
  }

  public async getTips(): Promise<Tip[]> {
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
    if (!isTips(object))
      throw new Error('An error happened when fetching tips.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}