import {
    Encounter,
    EncounterDTO,
    isCustomer,
    isCustomers
} from "@/types/Encounter"

export default class EncountersService {
    private _route = 'https://localhost:5000/api/encounters'
    private _headers = {
        'Content-Type': 'application/json'
    }

    public async getEncounters(): Promise<EncounterDTO[]> {
        const res = await fetch(this._route, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isCustomers(object))
            throw new Error('An error happened when fetching encounters.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getEncounter(data: { id: string }): Promise<Encounter> {
        const res = await fetch(`${this._route}/${data.id}`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isCustomer(object))
            throw new Error(`An error happened when fetching encounter ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getCustomerEncounters(data: { id: string }): Promise<EncounterDTO[]> {
        const res = await fetch(`${this._route}/customer/${data.id}`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isCustomers(object))
            throw new Error(`An error happened when fetching customer ${data.id} encounters.`, { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }
}