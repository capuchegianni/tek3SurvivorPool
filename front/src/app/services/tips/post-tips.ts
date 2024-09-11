import { Tip, BasicTip, isTip } from "@/app/types/Tip"
import FetchError from '@/app/types/FetchErrors'
import TipsService from '@/app/services/tips/class-tips'

export default class PostTipsService extends TipsService {
  public async postTip(data: BasicTip): Promise<Tip> {
    const res = await fetch(this._route, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify(data)
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when posting a tip.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }

    if (!isTip(object))
      throw new Error(`An error happened when posting tip.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

    return object
  }
}
