'use client';

import React, { useState, useEffect, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import Swal from 'sweetalert2'
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { EmployeeDTO } from "@/app/types/Employee";
import GetEmployeesService from "@/app/services/employees/get-employees";
import FetchError from "@/app/types/FetchErrors";
import { Event } from "@/app/types/Event";

const getEmployeesService = new GetEmployeesService()

export default function EditEvent({ onClose, currentEvent }: { onClose: () => void, currentEvent: Event }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Edit ${currentEvent.name}`} visible={visible} style={{width: '50vw'}} modal >
                <CustomersForm handleClose={handleClose} currentEvent={currentEvent}/>
            </Dialog>
        </div>
    )
}

function CustomersForm({handleClose, currentEvent}: {handleClose: () => void, currentEvent: Event}) {
    const [name, setName] = useState<string>(currentEvent.name);
    const [date, setDate] = useState<string>(currentEvent.date);
    const [duration, setDuration] = useState<string | number>(currentEvent.duration);
    const [maxParticipant, setMaxParticipant] = useState<string | number>(currentEvent.max_participants);
    const [type, setType] = useState<string>(currentEvent.type);
    const [responsible, setResponsible] = useState<string>(currentEvent.employee_id.toString());
    const [locationName, setLocationName] = useState<string>(currentEvent.location_name);
    const [positionX, setPositionX] = useState<string>(currentEvent.location_x);
    const [positionY, setPositionY] = useState<string>(currentEvent.location_y);

    const handleSave = () => {
        if (date?.length !== 10) {
            ToasterError({message: 'Please enter a valid date (dd/mm/yyyy)'});
            return;
        }

        if (name === undefined || duration === undefined || maxParticipant === undefined || type === undefined || responsible === undefined || locationName === undefined || positionX === undefined || positionY === undefined || date === undefined) {
            ToasterError({message: 'Please fill all the fields'});
            return;
        }

        const rightOrderDate = date.split('/').reverse().join('/');

        const customerData = {
            name,
            rightOrderDate,
            duration,
            maxParticipant,
            type,
            responsible,
            locationName,
            positionX,
            positionY
        };
        console.log(customerData);
    }

    const eventDate = new Date(currentEvent.date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
    const year = eventDate.getFullYear();

    const eventDateOrdered = `${day}/${month}/${year}`;

    return (
        <div className="flex flex-col">
            <div className="flex">
                <FormsDetails value={name} setValue={setName} title="Name" />
                <FormsDetails value={type} setValue={setType} title="Type" style="ml-2"/>
            </div>
            <FormsDetails value={locationName} setValue={setLocationName} title="Location" />
            <div className="flex">
                <FormsDetails value={positionX} setValue={setPositionX} title="Position X" />
                <FormsDetails value={positionY} setValue={setPositionY} title="Position Y" style="ml-2"/>
            </div>
            <label htmlFor="date" className="flex flex-col w-full pt-3">
                Date
                <InputMask id="date" mask="99/99/9999" onChange={(e) => setDate(e.target.value || '')} className="w-full" value={eventDateOrdered}/>
            </label>
            <label htmlFor="stacked-buttons" className="flex flex-col w-full pt-3">
                Duration (in hours)
                <InputNumber inputId="stacked-buttons" value={Number(duration)} onValueChange={(e) => setDuration(e.value?.toString() || '')} showButtons />
            </label>
            <label htmlFor="stacked-buttons" className="flex flex-col w-full pt-3">
                Max participants
                <InputNumber inputId="stacked-buttons" value={Number(maxParticipant)} onValueChange={(e) => setMaxParticipant(e.value?.toString() || '')} showButtons />
            </label>
            <label htmlFor="responsible" className="flex flex-col w-full pt-3">
                Responsible
                <ChoseResponsible setResponsible={setResponsible}/>
            </label>
            <div className="flex justify-around">
                <Button label="Save" className="w-1/4 mt-6" onClick={handleSave} />
                <Button label="Cancel" className="w-1/4 mt-6 bg-red-600 border-none" onClick={handleClose} />
            </div>
        </div>
    )
}

function FormsDetails({ value, setValue, title, style }: {value: string, setValue: (value: string) => void, title: string, style?: string}) {
    return (
        <label htmlFor={value} className="flex flex-col w-full pt-3">
            {title}
            <InputText id={value} value={value} onChange={(e) => setValue(e.target.value)} className={style} />
        </label>
    )
}

function ChoseResponsible({setResponsible, responsible: initialResponsible}: {setResponsible: (value: string) => void, responsible?: string}) {
    const [employee, setEmployee] = useState<EmployeeDTO[]>([]);
    const [responsible, setLocalResponsible] = useState<string>(initialResponsible || '');

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const employees = await getEmployeesService.getEmployees();
                const employeesWithLabel = employees.map(emp => ({
                    ...emp,
                    label: `${emp.name} ${emp.surname}`
                }));
                const currentEmployee = await getEmployeesService.getEmployee({ id: Number(responsible) ?? 0 }).catch(error => {
                    console.error(error);
                    return null;
                });

                const employeeFullName = `${currentEmployee?.name} ${currentEmployee?.surname}`;
                setEmployee(employeesWithLabel);
                setLocalResponsible(employeeFullName);

            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }
        getCustomers()
    }, []);

    const employeeFullName = responsible;

    const handleResponsibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalResponsible(e.target.value);
        setResponsible(e.target.value);
    }

    return (
        <div className="inline-block relative">
            <select value={employeeFullName} onChange={handleResponsibleChange} className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                {employee.map((emp, index) => (
                    <option key={index} value={emp.id}>
                        {emp.name} {emp.surname}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 12l-6-6h12l-6 6z" />
                </svg>
            </div>
        </div>
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