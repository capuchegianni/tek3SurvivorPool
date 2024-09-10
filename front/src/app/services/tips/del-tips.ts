import FetchError from '@/app/types/FetchErrors'
import TipsService from '@/app/services/tips/class-tips'

export default class DelTipsService extends TipsService {
  public async delTip(data: { id: number }): Promise<void> {
    const res = await fetch(`${this._route}/${data.id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
    const object = await res.json()

    if (!res.ok) {
      throw new FetchError({
        message: 'An error occured when deleting a tip.',
        status: res.status,
        statusText: res.statusText,
        details: object.details
      })
    }
  }
}
