'use client';

import React, { useState, useEffect } from "react";
import { BasicEmployeeWithID, Employee } from "@/app/types/Employee";
import GetEmployeesService from "@/app/services/employees/get-employees";
import { useParams } from "next/navigation";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Image from 'next/image'
import FetchError from "@/app/types/FetchErrors";
import { Event } from "@/app/types/Event";
import { BasicCustomerWithID } from "@/app/types/Customer";
import GetCustomersService from "@/app/services/customers/get-customers";

const getCustomersService = new GetCustomersService()

const getEmployeesService = new GetEmployeesService()

export default function ProfileId() {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<BasicEmployeeWithID | null>(null)
    const [employeeImage, setEmployeeImage] = useState<string | null>(null)
    const [employeeEvents, setEmployeeEvents] = useState<Event[]>([])
    const [employeeCustomers, setEmployeeCustomers] = useState<BasicCustomerWithID[]>([])

    useEffect(() => {
        const getEmployee = async () => {
            try {
                const fetchedEmployee = await getEmployeesService.getEmployee({ id: Number(id) })

                setEmployee(fetchedEmployee)
                setEmployeeImage(await getEmployeesService.getEmployeeImage({ id: fetchedEmployee.id }))
                setEmployeeEvents(await getEmployeesService.getEvents({ id: fetchedEmployee.id }))

                const customersIds = await getEmployeesService.getAssignedCustomers({ id: fetchedEmployee.id })
                setEmployeeCustomers(await Promise.all(customersIds.map(id => getCustomersService.getCustomer({ id }))))
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
                console.log(error)
            }
        }

        getEmployee()
    }, [id])

    return (
        <div className="flex flex-col m-6">
            <div className="text-3xl sm:text-4xl font-bold mb-6">
                <p> Employee details </p>
            </div>
            <div className="flex flex-grow h-full lg:flex-row flex-col">
                <div className="flex-grow bg-white h-full lg:max-w-lg mr-4 border-2 rounded-md">
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
                            <p> { employeeEvents.length } organized </p>
                        </div>
                        <div>
                            <p className="text-lg font-bold"> Customers </p>
                            <p> { employeeCustomers.length } </p>
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
                        <DataTable value={employeeEvents} header='Events' size="small" rows={5} paginator>
                            <Column field="id" header="ID" />
                            <Column field="name" header="Name" />
                            <Column field="date" header="Date" />
                            <Column field="max_participants" header="Participants" />
                            <Column field="type" header="Type" />
                        </DataTable>
                    </div>
                    <div className="p-4">
                        <DataTable value={employeeCustomers} header='Customers' size="small" rows={4} paginator>
                            <Column field="id" header="ID" />
                            <Column field="name" header="Name" />
                            <Column field="surname" header="Last name" />
                            <Column field="gender" header="Gender" />
                            <Column field="email" header="Email" />
                            <Column field="phone_number" header="Phone" />
                        </DataTable>
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
