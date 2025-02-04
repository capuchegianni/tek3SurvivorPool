'use client';

import React, { useState, useEffect } from "react";
import { Employee, BasicEmployee } from "@/app/types/Employee";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import Swal from 'sweetalert2'
import PutEmployeesService from "@/app/services/employees/put-employees";
import FetchError from "@/app/types/FetchErrors";

const putEmployeesService = new PutEmployeesService()

export default function EditEmployee({ employee, onClose, employees, setEmployees }: { employee: Employee, onClose: () => void, employees: Employee[], setEmployees: (value: Employee[]) => void }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Edit ${employee.name} ${employee.surname}`} visible={visible} style={{width: '50vw'}} modal >
                <EmployeeForm employee={employee} handleClose={handleClose} employees={employees} setEmployees={setEmployees} />
            </Dialog>
        </div>
    )
}

function EmployeeForm({ employee, handleClose, employees, setEmployees }: { employee: Employee, handleClose: () => void,employees: Employee[], setEmployees: (value: Employee[]) => void }) {
    const [name, setName] = useState<string>(employee.name);
    const [surname, setSurname] = useState<string>(employee.surname);
    const [email, setEmail] = useState<string>(employee.email);
    const [gender, setGender] = useState<string>(employee.gender);
    const [birthDateSave, setBirthDateSave] = useState<string>(employee.birth_date);
    const [work, setWork] = useState<string>(employee.work);

    const handleSave = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            ToasterError({message: 'Please enter a valid email address'});
            return;
        }
        if (birthDateSave.length !== 10) {
            ToasterError({message: 'Please enter a valid birthdate (dd/mm/yyyy)'});
            return;
        }

        const birth_date = birthDateSave.split('/').reverse().join('/');

        try {
            const employeeData: BasicEmployee = {
                name,
                surname,
                email,
                gender,
                birth_date,
                work
            };

            const updatedEmployee = await putEmployeesService.putEmployee({ id: employee.id, employee: employeeData });
            const index = employees.findIndex(emp => emp.id === updatedEmployee.id);

            if (index !== -1) {
                employees[index] = updatedEmployee;
                setEmployees([...employees]);
            }
            handleClose()
            Swal.fire({
                title: 'Successfully edited an employee.',
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
                position: 'top-right',
                toast: true,
                showConfirmButton: false
              })
        } catch (error) {
            if (error instanceof FetchError)
                error.logError()
            else
                console.error(error)
        }
    }

    const birthDate = new Date(employee.birth_date);
    const day = birthDate.getDate().toString().padStart(2, '0');
    const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
    const year = birthDate.getFullYear();

    const birthDateOrdered = `${day}/${month}/${year}`;

    return (
        <div className="flex flex-col">
            <div className="flex">
                <FormsDetails value={name} setValue={setName} title="Name" />
                <FormsDetails value={surname} setValue={setSurname} title="Surname" />
            </div>
            <FormsDetails value={email} setValue={setEmail} title="Email" />
            <FormsDetails value={work} setValue={setWork} title="Work" />
            <label htmlFor="birthDate" className="flex flex-col w-full pt-3">
                Birth date
                <InputMask id="birthDate" mask="99/99/9999" value={birthDateOrdered} onChange={(e) => setBirthDateSave(e.target.value || '')} className="w-full"/>
            </label>
            <label htmlFor="gender" className="flex flex-col w-full pt-3">
                Gender
                <GenderRadio initialGender={employee.gender} setGender={setGender}/>
            </label>
            <div className="flex justify-around">
                <Button label="Save" className="w-1/4 mt-6" onClick={handleSave} />
                <Button label="Cancel" className="w-1/4 mt-6 bg-red-600 border-none" onClick={handleClose} />
            </div>
        </div>
    )
}

function GenderRadio({initialGender, setGender}: {initialGender: string, setGender: (value: string) => void}) {
    const [gender, setLocalGender] = useState<string>(initialGender);

    useEffect(() => {
        try {
            setGender(gender);
        } catch (error) {
            if (error instanceof FetchError)
                error.logError()
        }
    }, [gender, setGender]);

    return (
        <div className="flex flex-wrap gap-3">
            <RadioButtons genderTitle={'Male'} gender={gender} setGender={setLocalGender} />
            <RadioButtons genderTitle={'Female'} gender={gender} setGender={setLocalGender} />
            <RadioButtons genderTitle={'Other'} gender={gender} setGender={setLocalGender} />
        </div>
    )
}

function RadioButtons({genderTitle, gender, setGender}: {genderTitle: string, gender: string, setGender: (value: string) => void }) {
    const handleChange = (e: RadioButtonChangeEvent) => {
        setGender(e.value);
    }

    return (
        <div className="flex align-items-center">
            <RadioButton inputId="ingredient1" name="gender" value={genderTitle} onChange={handleChange} checked={gender === genderTitle} />
            <label htmlFor="ingredient1" className="ml-2">{genderTitle}</label>
        </div>
    )
}

function FormsDetails({ value, setValue, title }: {value: string, setValue: (value: string) => void, title: string}) {
    return (
        <label htmlFor={value} className="flex flex-col w-full pt-3">
            {title}
            <InputText id={value} value={value} onChange={(e) => setValue(e.target.value)} className="w-full" />
        </label>
    )
}

function ToasterError({message}: {message: string}) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });
}