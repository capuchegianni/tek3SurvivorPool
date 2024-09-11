'use client';

import React, { useState } from "react";
import { Employee } from "@/app/types/Employee";
import DelEmployeesService from "@/app/services/employees/del-employees";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import Swal from 'sweetalert2'
import EditEmployee from "./edit";
import AddEmployee from "./addCoach";
import FetchError from "@/app/types/FetchErrors";

const delEmployeesService = new DelEmployeesService()

export default function EmployeesTable({ employees, setEmployees }: { employees: Employee[], setEmployees: (value: Employee[]) => void }) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showAddEmployees, setShowAddEmployees] = useState(false);

    const filteredEmployees = employees.filter((employee) => {
        return employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || employee.surname.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const inputText = () => {
        return (
            <div className="flex justify-between">
                <InputText value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." />
                <Button label="Add new coach" className="mr-6" icon="pi pi-plus" onClick={() => setShowAddEmployees(true)}/>
            </div>
        )
    }

    return (
        <div className="p-6 border-0">
            <DisplayAllCustomers employees={filteredEmployees} setEmployees={setEmployees} inputText={inputText}/>
            {showAddEmployees && <AddEmployee onClose={() => setShowAddEmployees(false)} employees={employees} setEmployees={setEmployees} />}
        </div>
    )
}

function DisplayAllCustomers({ employees, setEmployees, inputText }: { employees: Employee[], setEmployees: (value: Employee[]) => void, inputText?: () => JSX.Element }) {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const employeeTemplate = (rowData: Employee) => {
        return (
            <div>
                {rowData.name} {rowData.surname}
            </div>
        );
    };

    const employeeActions = (rowData: Employee) => {
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
                    await delEmployeesService.delEmployee({ id: rowData.id })
                    setEmployees(employees.filter(employee => employee.id !== rowData.id))
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
                <Button className="bg-white rounded-3xl text-blue-400 border-blue-400" icon="pi pi-pencil" onClick={() => setSelectedEmployee(rowData)}/>
                <Button className="bg-white rounded-3xl ml-3 text-red-400 border-red-400" icon="pi pi-trash" onClick={handleDelete}/>
            </div>
        )
    }

    return (
        <div>
            <DataTable value={employees} onRowClick={(e) => window.location.href = `/profile/coach/${e.data.id}`} className="cursor-pointer" rows={8} paginator header={inputText}>
                <Column body={employeeTemplate} header="Coach" />
                <Column field="email" header="Email" />
                <Column field="work" header="Work" />
                <Column className="flex justify-end" body={employeeActions} header="Actions" />
            </DataTable>
            {selectedEmployee && <EditEmployee employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} employees={employees} setEmployees={setEmployees} />}
        </div>
    )
}
