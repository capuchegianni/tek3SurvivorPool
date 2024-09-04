import { getAuthHeader } from "./authToken"

export default class ClothesService {
  private _route = 'http://localhost:5000/api/clothes'
  private _headers = {
    'Content-Type': 'application/json',
    'Authorization': getAuthHeader()
  }

  public async getClotheImage(data: { id: string }): Promise<string> {
    const res = await fetch(`${this._route}/${data.id}/image`, {
      method: 'GET',
      headers: this._headers
    })
    if (!res.ok) {
      throw Error(JSON.stringify({
        code: res.status,
        message: res.statusText
      }))
    }

    return await res.json()
  }
}