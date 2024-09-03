export default class ClothesService {
    private _route = 'https://localhost:5000/api/clothes'
    private _headers = {
        'Content-Type': 'application/json'
    }

    public async getClotheImage(data: { id: string }): Promise<string> {
        const res = await fetch(`${this._route}/${data.id}/image`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        return await res.json()
    }
}