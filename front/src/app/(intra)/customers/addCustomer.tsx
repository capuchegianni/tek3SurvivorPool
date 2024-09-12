'use client';

import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import Swal from 'sweetalert2'

import PostCustomersService from "@/app/services/customers/post-customers";
import { BasicCustomer, Customer } from "@/app/types/Customer";
import FetchError from "@/app/types/FetchErrors";

const postCustomersService = new PostCustomersService()

const astrologicalSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export default function AddCustomer({ onClose, customers, setCustomers }: { onClose: () => void, customers: Customer[], setCustomers: (value: Customer[]) => void }) {
    const [visible, setVisible] = useState<boolean>(true);

    const handleClose = () => {
        setVisible(false);
        onClose();
    }

    return (
        <div>
            <Dialog onHide={handleClose} header={`Add new customer`} visible={visible} style={{width: '50vw'}} modal >
                <CustomersForm handleClose={handleClose} customers={customers} setCustomers={setCustomers} />
            </Dialog>
        </div>
    )
}

function CustomersForm({ handleClose, customers, setCustomers }: { handleClose: () => void, customers: Customer[], setCustomers: (value: Customer[]) => void }) {
    const [name, setName] = useState<string>();
    const [surname, setSurname] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [phoneNumber, setPhone] = useState<string>();
    const [address, setAddress] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [astrologicalSign, setAstrologicalSign] = useState<string>();
    const [gender, setGender] = useState<string>();
    const [birthDateSave, setBirthDateSave] = useState<string>();

    const handleSave = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10,15}$/;

        if (!emailRegex.test(email ?? '')) {
            ToasterError({message: 'Please enter a valid email address'});
            return;
        }
        if (!phoneRegex.test(phoneNumber ?? '')) {
            ToasterError({message: 'Please enter a valid phone number (10 to 15 digits)'});
            return;
        }

        if (birthDateSave?.length !== 10) {
            ToasterError({message: 'Please enter a valid birthdate (dd/mm/yyyy)'});
            return;
        }

        if (!name || !surname || !email || !phoneNumber || !address || !description || !gender || !astrologicalSign) {
            ToasterError({message: 'Please fill all the fields'});
            return;
        }

        const birth_date = birthDateSave.split('/').reverse().join('/');

        try {
            const customerData: BasicCustomer = {
                name,
                surname,
                email,
                gender,
                birth_date,
                astrological_sign: astrologicalSign,
                address,
                description,
                phone_number: phoneNumber
            };

            customers.push(await postCustomersService.postCustomer(customerData))

            setCustomers([...customers])
            handleClose()
            Swal.fire({
                title: 'Successfully added a new customer.',
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
            <FormsDetails value={'phone_number'} setValue={setPhone} title="Phone" />
            <FormsDetails value={'address'} setValue={setAddress} title="Address" />
            <label htmlFor="birthDate" className="flex flex-col w-full pt-3">
                Birth date
                <InputMask id="birthDate" mask="99/99/9999" onChange={(e) => setBirthDateSave(e.target.value || '')} className="w-full"/>
            </label>
            <label htmlFor="astrological_sign" className="flex flex-col w-full pt-3">
                Astrological sign
                <AstroDropdown setAstrologicalSign={setAstrologicalSign} />
            </label>
            <label htmlFor="description" className="flex flex-col w-full pt-3">
                Description
                <InputTextarea autoResize id="descriptiong" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" />
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

function AstroDropdown({setAstrologicalSign}: {setAstrologicalSign: (value: string) => void}) {
    const [astrologicalSign, setLocalAstrologicalSign] = useState<string>();

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