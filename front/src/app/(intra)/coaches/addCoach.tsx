'use client';

import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import Swal from 'sweetalert2'
import { BasicEmployee, Employee } from "@/app/types/Employee";
import FetchError from "@/app/types/FetchErrors";
import PostEmployeesService from "@/app/services/employees/post-employees";

const postEmployeesService = new PostEmployeesService()

export default function AddEmployee({ onClose, employees, setEmployees }: { onClose: () => void, employees: Employee[], setEmployees: (value: Employee[]) => void }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Add new coach`} visible={visible} style={{width: '50vw'}} modal >
                <EmployeeForm handleClose={handleClose} employees={employees} setEmployees={setEmployees}/>
            </Dialog>
        </div>
    )
}

function EmployeeForm({ handleClose, employees, setEmployees }: { handleClose: () => void, employees: Employee[], setEmployees: (value: Employee[]) => void }) {
    const [name, setName] = useState<string>();
    const [surname, setSurname] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [work, setWork] = useState<string>();
    const [gender, setGender] = useState<string>();
    const [birthDateSave, setBirthDateSave] = useState<string>();

    const handleSave = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email ?? '')) {
            ToasterError({message: 'Please enter a valid email address'});
            return;
        }

        if (birthDateSave?.length !== 10) {
            ToasterError({message: 'Please enter a valid birthdate (dd/mm/yyyy)'});
            return;
        }

        if (!name || !surname || !email || !work || !gender) {
            ToasterError({message: 'Please fill all the fields'});
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

            employees.push(await postEmployeesService.postEmployee(employeeData))

            setEmployees([...employees])
            handleClose()
            Swal.fire({
                title: 'Successfully added a new employee.',
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

    return (
        <div className="flex flex-col">
            <div className="flex">
                <FormsDetails value={'name'} setValue={setName} title="Name" />
                <FormsDetails value={'surname'} setValue={setSurname} title="Surname" />
            </div>
            <FormsDetails value={'email'} setValue={setEmail} title="Email" />
            <FormsDetails value={'work'} setValue={setWork} title="Work" />
            <label htmlFor="birthDate" className="flex flex-col w-full pt-3">
                Birth date
                <InputMask id="birthDate" mask="99/99/9999" onChange={(e) => setBirthDateSave(e.target.value || '')} className="w-full"/>
            </label>
            <label htmlFor="gender" className="flex flex-col w-full pt-3">
                Gender
                <GenderRadio gender={gender} setGender={setGender}/>
            </label>
            <div className="flex justify-around">
                <Button label="Save" className="w-1/4 mt-6" onClick={handleSave} />
                <Button label="Cancel" className="w-1/4 mt-6 bg-red-600 border-none" onClick={handleClose} />
            </div>
        </div>
    )
}

function GenderRadio({gender, setGender}: {gender: string | undefined, setGender: (value: string) => void}) {
    return (
        <div className="flex flex-wrap gap-3">
            <RadioButtons genderTitle={'Male'} localGender={gender} setLocalGender={setGender} />
            <RadioButtons genderTitle={'Female'} localGender={gender} setLocalGender={setGender} />
            <RadioButtons genderTitle={'Other'} localGender={gender} setLocalGender={setGender} />
        </div>
    )
}

function RadioButtons({genderTitle, localGender, setLocalGender}: {genderTitle: string, localGender: string | undefined, setLocalGender: (value: string) => void }) {
    const handleChange = (e: RadioButtonChangeEvent) => {
        setLocalGender(e.value);
    }

    return (
        <div className="flex align-items-center">
            <RadioButton inputId="ingredient1" name="gender" value={genderTitle} onChange={handleChange} checked={localGender === genderTitle} />
            <label htmlFor="ingredient1" className="ml-2">{genderTitle}</label>
        </div>
    )
}

function FormsDetails({ value, setValue, title }: {value: string, setValue: (value: string) => void, title: string}) {
    return (
        <label htmlFor={value} className="flex flex-col w-full pt-3">
            {title}
            <InputText onChange={(e) => setValue(e.target.value)} className="w-full" />
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