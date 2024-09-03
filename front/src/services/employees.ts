import { Credentials, Token } from '@/types/Credentials'
import {
    EmployeeDTO,
    isEmployees,
    Employee,
    isEmployee
} from '@/types/Employee'
import fetch from 'node-fetch'

export default class EmployeesService {
    private _route = 'https://localhost:5000/api/employees'
    private _headers = {
        'Content-Type': 'application/json'
    }

    public async getEmployees(): Promise<EmployeeDTO[]> {
        const res = await fetch(this._route, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isEmployees(object))
            throw new Error('An error happened when fetching employees.', { cause: `Returned objects don't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async login(data: Credentials): Promise<Token> {
        const res = await fetch(`${this._route}/login`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        return await res.json()
    }

    public async getEmployee(data: { id: string }): Promise<Employee> {
        const res = await fetch(`${this._route}/${data.id}`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isEmployee(object))
            throw new Error(`An error happened when fetching employee ${data.id}.`, { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getEmployeeMe(): Promise<Employee> {
        const res = await fetch(`${this._route}/me`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        const object = await res.json()
        if (!isEmployee(object))
            throw new Error('An error happened when fetching your account.', { cause: `Returned object doesn't correspond to the associated type.\n${JSON.stringify(object)}` })

        return object
    }

    public async getEmployeeImage(data: { id: string }): Promise<string> {
        const res = await fetch(`${this._route}${data.id}/image`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error(`code: ${res.status}\nerror: ${res.statusText}`)

        return await res.json()
    }
}