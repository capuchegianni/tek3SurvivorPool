'use client';

import React, { useState, useEffect, useRef } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import Swal from 'sweetalert2'
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Employee } from "@/app/types/Employee";
import GetEmployeesService from "@/app/services/employees/get-employees";
import FetchError from "@/app/types/FetchErrors";

const getEmployeesService = new GetEmployeesService()

export default function AddEvent({ onClose }: { onClose: () => void }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Add new event`} visible={visible} style={{width: '50vw'}} modal >
                <CustomersForm handleClose={handleClose}/>
            </Dialog>
        </div>
    )
}

function CustomersForm({handleClose}: {handleClose: () => void}) {
    const [name, setName] = useState<string>();
    const [date, setDate] = useState<string>();
    const [duration, setDuration] = useState<string>();
    const [maxParticipant, setMaxParticipant] = useState<string>();
    const [type, setType] = useState<string>();
    const [responsible, setResponsible] = useState<string>();
    const [locationName, setLocationName] = useState<string>();
    const [positionX, setPositionX] = useState<string>();
    const [positionY, setPositionY] = useState<string>();

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

    return (
        <div className="flex flex-col">
            <div className="flex">
                <FormsDetails value={'name'} setValue={setName} title="Name" />
                <FormsDetails value={'type'} setValue={setType} title="Type" style="ml-2"/>
            </div>
            <FormsDetails value={'locationName'} setValue={setLocationName} title="Location" />
            <div className="flex">
                <FormsDetails value={'positionX'} setValue={setPositionX} title="Position X" />
                <FormsDetails value={'positiony'} setValue={setPositionY} title="Position Y" style="ml-2"/>
            </div>
            <label htmlFor="date" className="flex flex-col w-full pt-3">
                Date
                <InputMask id="date" mask="99/99/9999" onChange={(e) => setDate(e.target.value || '')} className="w-full"/>
            </label>
            <label htmlFor="stacked-buttons" className="flex flex-col w-full pt-3">
                Duration (in hours)
                <InputNumber inputId="stacked-buttons" value={Number(duration) || 0} onValueChange={(e) => setDuration(e.value?.toString() || '')} showButtons />
            </label>
            <label htmlFor="stacked-buttons" className="flex flex-col w-full pt-3">
                Max participants
                <InputNumber inputId="stacked-buttons" value={Number(maxParticipant) || 0} onValueChange={(e) => setMaxParticipant(e.value?.toString() || '')} showButtons />
            </label>
            <ChoseResponsible setResponsible={setResponsible}/>
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
            <InputText onChange={(e) => setValue(e.target.value)} className={style} />
        </label>
    )
}

function ChoseResponsible({setResponsible, responsible: initialResponsible}: {setResponsible: (value: string) => void, responsible?: string}) {
    const [employee, setEmployee] = useState<Employee[]>([]);
    const [responsible, setLocalResponsible] = useState<string>(initialResponsible || '');

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const employees = await getEmployeesService.getEmployees();
                const employeesWithLabel = employees.map(emp => ({
                    ...emp,
                    label: `${emp.name} ${emp.surname}`
                }));
                setEmployee(employeesWithLabel);
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }
        getCustomers()
    }, []);

    const handleResponsibleChange = (e: any) => {
        setLocalResponsible(e.value);
        setResponsible(e.value);
    }

    return (
        <div className="flex flex-col w-full pt-3">
            <label htmlFor="responsible">Responsible</label>
            <Dropdown value={responsible} onChange={handleResponsibleChange} options={employee}
                optionLabel="label"
                placeholder="Select a Coach" className="w-full md:w-14rem" checkmark={true}  highlightOnSelect={false} />
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