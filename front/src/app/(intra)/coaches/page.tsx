'use client';

import React, { useState, useEffect } from "react";

import GetEmployeesService from "@/app/services/employees/get-employees";
import { Employee } from "@/app/types/Employee";
import EmployeesTable from "@/app/(intra)/coaches/table";
import FetchError from "@/app/types/FetchErrors";

const getEmployeesService = new GetEmployeesService()

export default function Coaches() {
    const [employees, setEmployees] = useState<Employee[]>([])

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setEmployees(await getEmployeesService.getEmployees())
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
                else
                    console.error(error)
            }
        }
        getCustomers()
    }, []);

    return (
        <div>
            <div className="text-4xl font-light mt-6 ml-6"> Coaches List </div>
            <div className="text-gray-500 text-l font-light ml-6"> There is a total of {employees.length} coaches </div>
            <EmployeesTable employees={employees} setEmployees={setEmployees} />
        </div>
    )
}
