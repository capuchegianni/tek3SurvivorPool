'use client';

import React, { useState, useEffect } from "react";
import { BasicEmployeeWithID } from "@/app/types/Employee";
import GetEmployeesService from "@/app/services/employees/get-employees";
import { useParams } from "next/navigation";
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import Image from 'next/image'
import Link from 'next/link';

const getEmployeesService = new GetEmployeesService()

export default function ProfileId() {
    const { id } = useParams<{ id: string }>();
    const [employeeData, setEmployeeData] = useState<BasicEmployeeWithID | null>(null);
    const [employeeImage, setEmployeeImage] = useState<string | null>(null)

    useEffect(() => {
        const fetchEmployee = async () => {
            const customer = await getEmployeesService.getEmployee({ id: Number(id) }).catch(error => {
                console.error(error);
                return null;
            });

            setEmployeeData(customer);
            setEmployeeImage(await getEmployeesService.getEmployeeImage({ id: Number(id) }));
        }

        fetchEmployee();
    }, [id]);

    return (
        <div className="flex flex-col m-6">
            <div className="flex justify-between">
                <div className="text-3xl sm:text-4xl font-bold mb-6">
                    <p> Coach details </p>
                </div>
                <Link href="/coaches" >
                    <Button label="return" icon="pi pi-arrow-left" className="h-10" />
                </Link>
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
                        <p> { employeeData?.name } { employeeData?.surname } </p>
                    </div>
                    <div className="flex flex-row justify-around items-center text-center border-b-2 p-6">
                        <div>
                            {/* <p className="text-lg font-bold"> { encounters.length } </p> */}
                            <p> Total </p>
                            <p> Events </p>
                        </div>
                        <div>
                            {/* <p className="text-lg font-bold"> { encounters.length } </p> */}
                            <p> Total </p>
                            <p> Customers </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left p-6">
                        <p className="text-lg text-gray-400 font-bold"> Short details </p>
                        <ShortDetails name="User ID:" value={employeeData?.id} />
                        <ShortDetails name="Email:" value={employeeData?.email} />
                        <ShortDetails name="Gender:" value={employeeData?.gender} />
                        <ShortDetails name="Birth date:" value={new Date(employeeData ? employeeData.birthDate : 0).toUTCString().slice(0, 16)} />
                        <ShortDetails name="Work:" value={employeeData?.work} />
                    </div>
                </div>
                <div className="flex-grow bg-white h-full border-2 rounded-md">
                    <div className="p-4">
                        <DataTable header='Events' size="small" rows={5} paginator />
                            {/* <Column field="date" header="Date" style={{width:'10%'}}/>
                            <Column field="rating" header="Rating" body={rating} style={{width:'10%'}}/>
                            <Column field="comment" header="Report" style={{width:'50%'}}/>
                            <Column field="source" header="Source" style={{width:'10%'}} />
                        </DataTable> */}
                    </div>
                    <div className="p-4">
                        <DataTable header='Customer(s) linked' size="small" rows={4} paginator />
                            {/* <Column field="date" header="Date" style={{width:'25%'}}/>
                            <Column field="payment_method" header="Payment Method" style={{width:'25%'}}/>
                            <Column field="amount" header="Amount" style={{width:'25%'}}/>
                            <Column field="comment" header="Comment" style={{width:'40%'}}/>
                        </DataTable> */}
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
