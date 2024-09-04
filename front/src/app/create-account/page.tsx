'use client';

import React, { useState, useEffect } from "react";
import './account.css';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { Card } from 'primereact/card';
import Link from 'next/link';

interface Gender {
    type: string;
    code: string;
};

interface Work {
    type: string;
    code: string;
};

export default function CreateAccount() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    if (isLoading)
        return <div>Loading...</div>;

    return (
        <form>
            <div className="container-account">
                <img className="image" src="women_catch.png" />
                <Card className="custom-card">
                    <div className="">
                        <h2 className="personal-text">Create account</h2>
                        <div className="form-box">
                            <FirstName />
                            <LastName />
                            <EmailAddress />
                            <small className="info-mail">You must use a work related email address.</small>
                            <Gender />
                            <Work />
                        </div>
                    </div>
                    <div className="form-button">
                        <button className="button-save">Save</button>
                        <Link href="/">
                            <button type="button" className="button-cancel"> Cancel </button>
                        </Link>
                    </div>
                </Card>
                <img className="image" src="men_catch.png" />
            </div>
        </form>
    )
}

function EmailAddress() {
    const [value, setValue] = useState('');

    return (
        <div className="card flex justify-content-center title-category">
            <FloatLabel>
                <InputText required id="email" value={value} onChange={(e) => setValue(e.target.value)} />
                <label htmlFor="email">Email</label>
            </FloatLabel>
        </div>
    )
}

function LastName() {
    const [value, setValue] = useState('');

    return (
        <div className="card flex justify-content-center title-category">
            <FloatLabel>
                <InputText required id="lastname" value={value} onChange={(e) => setValue(e.target.value)} />
                <label htmlFor="lastname">Last name</label>
            </FloatLabel>
        </div>
    )
}

function FirstName() {
    const [value, setValue] = useState('');

    return (
        <div className="card flex justify-content-center title-category">
            <FloatLabel>
                <InputText required id="firstname" value={value} onChange={(e) => setValue(e.target.value)} />
                <label htmlFor="firstname">First name</label>
            </FloatLabel>
        </div>
    )
}

function Gender() {
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const genders: Gender[] = [
        {type: 'male', code: 'M'},
        {type: 'female', code: 'F'},
        {type: 'other', code: 'O'},
    ];

    return (
        <div className="card flex justify-content-left">
            <label htmlFor="work" className="title-category"> Gender </label>
            <Dropdown required value={selectedGender} onChange={(e: DropdownChangeEvent) => setSelectedGender(e.value)} options={genders} optionLabel="type" placeholder="Select a gender" className="w-full md:w-14rem" />
        </div>
    )
}

function Work() {
    const [selectedWork, setSelectedWork] = useState<Work | null>(null);
    const works: Work[] = [
        {type: 'Agency Manager', code: 'M'},
        {type: 'Coach (Employee)', code: 'C'},
    ];

    return (
        <div className="card flex justify-content-left">
            <label htmlFor="work" className="title-category"> Activity </label>
            <Dropdown required value={selectedWork} onChange={(e: DropdownChangeEvent) => setSelectedWork(e.value)} options={works} optionLabel="type" placeholder="Select your job" className="w-full md:w-14rem" />
        </div>
    )
}
