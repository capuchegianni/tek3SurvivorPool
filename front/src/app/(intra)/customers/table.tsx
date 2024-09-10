import React, { useState, useEffect, useRef } from "react";
import { CustomerDTO, Customer } from "@/app/types/Customer";
import CustomersService from '../../services/customers';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Popup } from "react-leaflet";

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

    const inputText = () => {
        return (
            <div className="flex justify-between">
                <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
                <Button label="Add new customers" className="mr-6" icon="pi pi-plus" />
            </div>
        )
    }

    return (
        <div className="p-6 border-0">
            <DisplayAllCustomers customers={filteredCustomers} inputText={inputText}/>
        </div>
    )
}

function DisplayAllCustomers({ customers, inputText }: { customers: Customer[], inputText?: () => JSX.Element }) {
    const customerTemplate = (rowData: Customer) => {
        return (
            <div>
                {rowData.name} {rowData.surname}
            </div>
        );
    };

    const customersActions = () => {
        return(
            <div>
                <Button className="bg-white rounded-3xl text-blue-400 border-blue-400" icon="pi pi-pencil" />
                <Button className="bg-white rounded-3xl ml-3 text-red-400 border-red-400" icon="pi pi-trash"/>
            </div>
        )
    }

    return (
        <DataTable value={customers} onRowClick={(e) => window.location.href = `/profile/${e.data.id}`} className="cursor-pointer" rows={8} paginator header={inputText}>
            <Column body={customerTemplate} header="Customer" style={{width:'30%'}}/>
            <Column field="email" header="Email" style={{width:'30%'}}/>
            <Column field="phoneNumber" header="Phone Number" style={{width:'30%'}}/>
            <Column body={customersActions} header="Actions" style={{width:'10%'}}/>
        </DataTable>
    )
}
