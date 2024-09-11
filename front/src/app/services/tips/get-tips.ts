import { Tip, isTip, isTips } from "@/app/types/Tip"
import FetchError from '@/app/types/FetchErrors'
import TipsService from '@/app/services/tips/class-tips'

export default class GetTipsService extends TipsService {
  public async getTip(data: { id: number }): Promise<Tip> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when fetching a tip.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isTip(object))
      throw new Error(`An error happened when fetching tip ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
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
