'use client';

import React, { useState, useEffect } from "react";
import { Customer } from "@/app/types/Customer";
import CustomersService from '../../../services/customers';
import { useParams } from "next/navigation";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Rating } from "primereact/rating";
import Image from 'next/image'
import { Encounter } from "@/app/types/Encounter";

const customerService = new CustomersService()

export default function ProfileId() {
    const { id } = useParams<{ id: string }>();
    const [customerData, setCustomerData] = useState<Customer | null>(null);
    const [customerImage, setCustomerImage] = useState<string | null>(null)
    const [positivesEncounters, setPositivesEncounters] = useState<number>(0);

    useEffect(() => {
        const fetchCustomer = async () => {
            const customer = await customerService.getCustomer({ id: Number(id) }).catch(error => {
                console.error(error);
                return null;
            });

            setCustomerData(customer);
            setCustomerImage(await customerService.getCustomerImage({ id: Number(id) }));

            const positives = customer?.encounters.filter(encounter => encounter.rating > 2.5).length || 0;
            setPositivesEncounters(positives);
        }

        fetchCustomer();
    }, [id]);

    const rating = (rating: Encounter) => {
        return (
            <div>
                <Rating value={rating.rating} disabled cancel={false} />
            </div>
        )
    }

    return (
        <div className="flex flex-col m-6">
            <div className="text-3xl sm:text-4xl font-bold mb-6">
                <p> Customer details </p>
            </div>
            <div className="flex flex-row flex-grow h-full">
                <div className="flex-grow bg-white h-full max-w-lg mr-4 border-2 rounded-md">
                    <div className="flex flex-col justify-center items-center text-center text-xl font-bold p-6 border-b-2">
                        <Image
                            src={`data:image/jpeg;base64,${customerImage}`}
                            alt="Employee picture"
                            width={100} height={100}
                            className="rounded-full pb-2"
                        />
                        <p> { customerData?.name } { customerData?.surname } </p>
                    </div>
                    <div className="flex flex-row justify-around items-center text-center border-b-2 p-6">
                        <div>
                            <p className="text-lg font-bold"> { customerData?.encounters.length } </p>
                            <p> Total </p>
                            <p> Encounter </p>
                        </div>
                        <div>
                            <p className="text-lg font-bold"> { positivesEncounters } </p>
                            <p> Positives </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left p-6">
                        <p className="text-lg text-gray-400 font-bold"> Short details </p>
                        <ShortDetails name="User ID:" value={customerData?.id} />
                        <ShortDetails name="Email:" value={customerData?.email} />
                        <ShortDetails name="Gender:" value={customerData?.gender} />
                        <ShortDetails name="Phone number:" value={customerData?.phone_number} />
                        <ShortDetails name="Address:" value={customerData?.address} />
                        <ShortDetails name="Birth date:" value={new Date(customerData ? customerData.birth_date : 0).toUTCString().slice(0, 16)} />
                    </div>
                </div>
                <div className="flex-grow bg-white h-full border-2 rounded-md">
                    <div className="p-4">
                        <DataTable value={customerData?.encounters} header='Encounter' size="small">
                            <Column field="date" header="Date" />
                            <Column field="rating" header="Rating" body={rating}/>
                            <Column field="comment" header="Report" />
                            <Column field="source" header="Source" />
                        </DataTable>
                    </div>
                    <div className="p-4">
                        <DataTable header='Payments History' size="small"/>
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
