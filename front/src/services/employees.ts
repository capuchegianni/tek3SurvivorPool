import { EmployeeDTO, isEmployees, Employee, isEmployee } from '@/types/Employee'
import fetch from 'node-fetch'

export default class EmployeesService {
    private _route: string = 'https://soul-connection/api/employees/'
    private _headers = {
        'Content-Type': 'application/json'
    }

    public async getEmployees(): Promise<EmployeeDTO[]> {
        const res = await fetch(this._route, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error()

        const object = await res.json()
        if (!isEmployees(object))
            throw Error()

        return object
    }

    public async login(data: { email: string, password: string }): Promise<{ access_token: string }> {
        const res = await fetch(`${this._route}login`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        if (!res.ok)
            throw Error()

        return await res.json()
    }

    public async getEmployee(data: { id: string }): Promise<Employee> {
        const res = await fetch(`${this._route}${data.id}`, {
            method: 'GET',
            headers: this._headers
        })
        if (!res.ok)
            throw Error()

        const object = await res.json()
        if (!isEmployee(object))
            throw Error()

        return object
    }
}