import { Tip, BasicTip, isTip } from "@/app/types/Tip"
import FetchError from '@/app/types/FetchErrors'
import TipsService from '@/app/services/tips/class-tips'

export default class PutTipsService extends TipsService {
  public async putTip(data: { id: number, tip: Partial<BasicTip> }): Promise<Tip> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data.tip)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when putting a tip.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isTip(object))
      throw new Error(`An error happened when putting tip ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
