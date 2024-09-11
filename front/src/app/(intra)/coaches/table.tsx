'use client';

import React, { useState, useEffect, useRef } from "react";
import { EmployeeDTO, Employee } from "@/app/types/Employee";
import GetEmployeesService from "@/app/services/employees/get-employees";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import Swal from 'sweetalert2'
import EditEmployee from "./edit";
import AddEmployee from "./addCoach";
import FetchError from "@/app/types/FetchErrors";

const getEmployeesService = new GetEmployeesService()

export default function EmployeesTable({ employees }: { employees?: EmployeeDTO[] }) {
    const [employeesData, setEmployeesData] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showAddEmployees, setShowAddEmployees] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const promises = (employees ?? []).map(customer =>
                    getEmployeesService.getEmployee({ id: customer.id }).catch(error => {
                        console.error(error);
                        return null;
                    })
                );
                const results = await Promise.all(promises);
                setEmployeesData(results.filter(result => result !== null) as Employee[]);
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }
        fetchEmployees();
    }, [employees]);

    const filteredEmployees = employeesData.filter((employee) => {
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
            <DisplayAllCustomers employees={filteredEmployees} inputText={inputText}/>
            {showAddEmployees && <AddEmployee onClose={() => setShowAddEmployees(false)} />}
        </div>
    )
}

function DisplayAllCustomers({ employees, inputText }: { employees: Employee[], inputText?: () => JSX.Element }) {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const employeeTemplate = (rowData: Employee) => {
        return (
            <div>
                {rowData.name} {rowData.surname}
            </div>
        );
    };

    const employeeActions = (rowData: Employee) => {
        const handleDelete = () => {
            Swal.fire({
                title: 'Delete: ' + rowData.name + ' ' + rowData.surname,
                text: "Are you sure you want to delete this?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Deleted coach: ', rowData.id);
                }
            })
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
                <Column body={employeeTemplate} header="Coach" style={{width:'30%'}}/>
                <Column field="email" header="Email" style={{width:'30%'}}/>
                <Column field="work" header="Work" style={{width:'30%'}}/>
                <Column body={employeeActions} header="Actions" style={{width:'10%'}}/>
            </DataTable>
            {selectedEmployee && <EditEmployee employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
        </div>
    )
}
