'use client';

import React, { useEffect, useState } from "react";
import { Customer } from "@/app/types/Customer";
import DelCustomersService from "@/app/services/customers/del-customers";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import Swal from 'sweetalert2'
import EditCustomers from "./edit";
import AddCustomer from "./addCustomer";
import FetchError from "@/app/types/FetchErrors";
import GetEmployeesService from "@/app/services/employees/get-employees";

const delCustomerService = new DelCustomersService()
const getEmployeesService = new GetEmployeesService()

export default function CustomersTable({ customers, setCustomers }: { customers: Customer[], setCustomers: (value: Customer[]) => void }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showAddCustomer, setShowAddCustomer] = useState(false);
    const [isCoach, setIsCoach] = useState(true)
    const [assignedCustomers, setAssignedCustomers] = useState<number[]>([])

    useEffect(() => {
        const getMyself = async () => {
            try {
                const myself = await getEmployeesService.getEmployeeMe()
                const assignedCustomers = await getEmployeesService.getAssignedCustomers({ id: myself.id })

                setIsCoach(myself.work.toLowerCase() === 'coach')
                setAssignedCustomers(assignedCustomers)
            } catch (error) {
                console.error(error)
            }
        }
        getMyself()
    }, [])

    const filteredCustomers = customers.filter((customer) => {
        if (isCoach) {
            if (assignedCustomers.includes(customer.id))
                return true
            return false
        }
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.surname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const inputText = () => {
        return (
            <div className="flex justify-between">
                <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
                <div>
                    <Button label="Assign a customer to a coach" className="mr-2" icon="pi pi-plus" disabled={true}/>
                    <Button label="Add new customers" className="mr-6" icon="pi pi-plus" onClick={() => setShowAddCustomer(true)} disabled={isCoach}/>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 border-0">
            <DisplayAllCustomers customers={filteredCustomers} inputText={inputText} setCustomers={setCustomers}/>
            {showAddCustomer && <AddCustomer onClose={() => setShowAddCustomer(false)} customers={customers} setCustomers={setCustomers} />}
        </div>
    )
}

function DisplayAllCustomers({ customers, inputText, setCustomers }: { customers: Customer[], inputText?: () => JSX.Element, setCustomers: (value: Customer[]) => void }) {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const customerTemplate = (rowData: Customer) => {
        return (
            <div>
                {rowData.name} {rowData.surname}
            </div>
        );
    };

    const customersActions = (rowData: Customer) => {
        const handleDelete = async () => {
            const result = await Swal.fire({
                title: 'Delete: ' + rowData.name + ' ' + rowData.surname,
                text: "Are you sure you want to delete this?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })

            try {
                if (result.isConfirmed) {
                    await delCustomerService.delCustomer({ id: rowData.id })
                    setCustomers(customers.filter(customer => customer.id !== rowData.id))
                }
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
                else
                    console.error(error)
            }
        }

        return(
            <div>
                <Button className="bg-white rounded-3xl text-blue-400 border-blue-400" icon="pi pi-pencil" onClick={() => setSelectedCustomer(rowData)}/>
                <Button className="bg-white rounded-3xl ml-3 text-red-400 border-red-400" icon="pi pi-trash" onClick={handleDelete}/>
            </div>
        )
    }

    return (
        <div>
            <DataTable value={customers} onRowClick={(e) => window.location.href = `/profile/customer/${e.data.id}`} className="cursor-pointer" rows={8} paginator header={inputText}>
                <Column body={customerTemplate} header="Customer" />
                <Column field="email" header="Email" />
                <Column field="phone_number" header="Phone Number" />
                <Column body={customersActions} header="Actions" className="flex justify-end"/>
            </DataTable>
            {selectedCustomer && <EditCustomers customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} customers={customers} setCustomers={setCustomers} />}
        </div>
    )
}
