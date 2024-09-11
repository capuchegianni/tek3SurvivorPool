'use client';

import React, { useState, useEffect } from "react";

import CustomersService from "@/app/services/customers/class-customers";
import { CustomerDTO } from '../../types/Customer'
import CustomersTable from "./table";

const customerService = new CustomersService()

export default function Customers() {
    const [customers, setCustomers] = useState<CustomerDTO[]>([])

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setCustomers(await customerService.getCustomers())
            } catch (error) { }
        }
        getCustomers()
    }, []);

    return (
        <div>
            <div className="text-4xl font-light mt-6 ml-6"> Customers List </div>
            <div className="text-gray-500 text-l font-light ml-6"> You have total {customers.length} customers </div>
            <CustomersTable customers={customers} />
        </div>
    )
}
