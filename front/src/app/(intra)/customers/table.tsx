import React, { useState, useEffect, useRef } from "react";
import { CustomerDTO, Customer } from "@/app/types/Customer";
import CustomersService from '../../services/customers';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const customerService = new CustomersService()

export default function CustomersTable({ customers }: { customers?: CustomerDTO[] }) {
    const [customersData, setCustomersData] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchCustomers = async () => {
            const promises = (customers ?? []).map(customer =>
                customerService.getCustomer({ id: customer.id }).catch(error => {
                    console.error(error);
                    return null;
                })
            );

            const results = await Promise.all(promises);
            setCustomersData(results.filter(result => result !== null) as Customer[]);
        }

        fetchCustomers();
    }, [customers]);

    const filteredCustomers = customersData.filter((customer) => {
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.surname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="p-6 border-0">
            <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
            <DisplayAllCustomers customers={filteredCustomers} />
        </div>
    )
}

function DisplayAllCustomers({ customers }: { customers: Customer[] }) {
    const customerTemplate = (rowData: Customer) => {
        return (
            <div>
                <a href={`/profile/${rowData.id}`}>{rowData.name} {rowData.surname}</a>
            </div>
        );
    };

    return (
        <DataTable value={customers}>
            <Column body={customerTemplate} header="Customer"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="phone_number" header="Phone Number"></Column>
        </DataTable>
    )
}
