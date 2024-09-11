'use client';

import React, { useState, useEffect } from "react";

import GetEmployeesService from "@/app/services/employees/get-employees";
import { EmployeeDTO } from "@/app/types/Employee";
import EmployeesTable from "@/app/(intra)/coaches/table";

const getEmployeesService = new GetEmployeesService()

export default function Coaches() {
    const [employee, setEmployee] = useState<EmployeeDTO[]>([])

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setEmployee(await getEmployeesService.getEmployees())
            } catch (error) { }
        }
        getCustomers()
    }, []);

    return (
        <div>
            <div className="text-4xl font-light mt-6 ml-6"> Coaches List </div>
            <div className="text-gray-500 text-l font-light ml-6"> There is a total of {employee.length} coaches </div>
            <EmployeesTable employees={employee} />
        </div>
    )
}
