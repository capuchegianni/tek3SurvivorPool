'use client';

import React, { useState, useEffect, useRef } from "react";
import { Customer } from "@/app/types/Customer";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import Swal from 'sweetalert2'

const astrologicalSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function EditCustomers({ customer, onClose }: { customer: Customer, onClose: () => void }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Edit ${customer.name} ${customer.surname}`} visible={visible} style={{width: '50vw'}} modal >
                <CustomersForm customer={customer} handleClose={handleClose}/>
            </Dialog>
        </div>
    )
}

function CustomersForm({customer, handleClose}: {customer: Customer, handleClose: () => void}) {
    const [name, setName] = useState<string>(customer.name);
    const [surname, setSurname] = useState<string>(customer.surname);
    const [email, setEmail] = useState<string>(customer.email);
    const [phone, setPhone] = useState<string>(customer.phoneNumber);
    const [address, setAddress] = useState<string>(customer.address);
    const [description, setDescription] = useState<string>(customer.description);
    const [astrologicalSign, setAstrologicalSign] = useState<string>(customer.astrologicalSign);
    const [gender, setGender] = useState<string>(customer.gender);
    const [birthDateSave, setBirthDateSave] = useState<string>(customer.birthDate);

    const handleSave = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10,15}$/;

        if (!emailRegex.test(email)) {
            ToasterError({message: 'Please enter a valid email address'});
            return;
        }
        if (!phoneRegex.test(phone)) {
            ToasterError({message: 'Please enter a valid phone number (10 to 15 digits)'});
            return;
        }

        if (birthDateSave.length !== 10) {
            ToasterError({message: 'Please enter a valid birthdate (dd/mm/yyyy)'});
            return;
        }

        const rightOrderBirthday = birthDateSave.split('/').reverse().join('/');

        const customerData = {
            name,
            surname,
            email,
            phone,
            address,
            description,
            astrologicalSign,
            gender,
            rightOrderBirthday
        };
        console.log(customerData);
    }

    const birthDate = new Date(customer.birthDate);
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
            <FormsDetails value={phone} setValue={setPhone} title="Phone" />
            <FormsDetails value={address} setValue={setAddress} title="Address" />
            <label htmlFor="birthDate" className="flex flex-col w-full pt-3">
                Birth date
                <InputMask id="birthDate" mask="99/99/9999" value={birthDateOrdered} onChange={(e) => setBirthDateSave(e.target.value || '')} className="w-full"/>
            </label>
            <label htmlFor="astrological_sign" className="flex flex-col w-full pt-3">
                Astrological sign
                <AstroDropdown customer={customer} setAstrologicalSign={setAstrologicalSign} />
            </label>
            <label htmlFor="description" className="flex flex-col w-full pt-3">
                Description
                <InputTextarea autoResize id="descriptiong" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" />
            </label>
            <label htmlFor="gender" className="flex flex-col w-full pt-3">
                Gender
                <GenderRadio initialGender={customer.gender} setGender={setGender}/>
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
        setGender(gender);
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

function AstroDropdown({customer, setAstrologicalSign}: {customer: Customer, setAstrologicalSign: (value: string) => void}) {
    const [astrologicalSign, setLocalAstrologicalSign] = useState<string>(customer.astrologicalSign);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalAstrologicalSign(e.target.value);
        setAstrologicalSign(e.target.value);
    }

    return (
        <div className="inline-block relative">
            <select id="astrological_sign" value={astrologicalSign} onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                {astrologicalSigns.map((sign) => (
                <option key={sign} value={sign}>
                    {sign}
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