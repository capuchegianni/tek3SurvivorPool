'use client';

import React, { useEffect, useState } from "react";
import Image from 'next/image'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Employee } from "@/app/types/Employee";
import EmployeesService from "@/app/services/employees/class-employees";
import FetchError from "@/app/types/FetchErrors";

const employeesService = new EmployeesService()

export default function Coaches() {
    const [employee, setEmployee] = useState<Employee | null>(null)
    const [employeeImage, setEmployeeImage] = useState<string | null>(null)

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const fetchedEmployee = await employeesService.getEmployeeMe()

                setEmployee(fetchedEmployee)
                setEmployeeImage(await employeesService.getEmployeeImage({ id: fetchedEmployee.id }))
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }

        getEmployee()
    }, [])

    return (
        <div className="flex flex-col m-6">
            <div className="text-3xl sm:text-4xl font-bold mb-6">
                <p> Employee details </p>
            </div>
            <div className="flex flex-row flex-grow h-full">
                <div className="flex-grow bg-white h-full max-w-lg mr-4 border-2 rounded-md">
                    <div className="flex flex-col justify-center items-center text-center text-xl font-bold p-6 border-b-2">
                        <Image
                            src={`data:image/jpeg;base64,${employeeImage}`}
                            alt="Employee picture"
                            width={100} height={100}
                            className="rounded-full pb-2"
                        />
                        <p> { employee?.name } { employee?.surname } </p>
                    </div>
                    <div className="flex flex-row justify-around items-center text-center border-b-2 p-6">
                        <div>
                            <p className="text-lg font-bold"> Events </p>
                            <p> { employee?.events.length } organized </p>
                        </div>
                        <div>
                            <p className="text-lg font-bold"> Customers </p>
                            <p> upcoming </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left p-6">
                        <p className="text-lg text-gray-400 font-bold"> Short details </p>
                        <ShortDetails name="User ID:" value={employee?.id} />
                        <ShortDetails name="Email:" value={employee?.email} />
                        <ShortDetails name="Gender:" value={employee?.gender} />
                        <ShortDetails name="Work:" value={employee?.work} />
                        <ShortDetails name="Birth date:" value={new Date(employee ? employee.birth_date : 0).toUTCString().slice(0, 16)} />
                    </div>
                </div>
                <div className="flex-grow bg-white h-full border-2 rounded-md">
                    <div className="p-4">
                        <DataTable value={employee?.events} header='Events' size="small">
                            <Column field="id" header="ID" />
                            <Column field="name" header="Name" />
                            <Column field="date" header="Date" />
                            <Column field="max_participants" header="Participants" />
                            <Column field="type" header="Type"></Column>
                        </DataTable>
                    </div>
                    <div className="p-4">
                        <DataTable header='Customers' size="small"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ShortDetails = ({ name, value }: { name: string, value: string | number | undefined }) => {
    return (
        <div className="p-2">
            <p className="text-sm text-gray-400"> { name } </p>
            <p className="text-sm"> { value } </p>
        </div>
    )
}
