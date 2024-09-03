'use client';

import React, { useState } from "react";
import './account.css';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Gender {
    type: string;
    code: string;
}

export default function CreateAccount() {
    return (
        <form>
            <div>
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="profile-text">Profile</h2>
                </div>
                <div className="">
                    <h2 className="personal-text">Create account</h2>
                    <div className="form-box">
                        <FirstName />
                        <LastName />
                        <EmailAddress />
                        <p className="info-mail">Use a permanent address where you can receive mail.</p>
                        <Gender />
                        <Work />
                    </div>
                </div>
            </div>
            <div className="form-button">
                <button className="button-save">Save</button>
                <button type="button" className="button-cancel"> Cancel </button>
            </div>
        </form>
    )
}

function EmailAddress() {
    return (
        <div className="">
            <label htmlFor="email" className="title-category"> Email address </label>
            <div className="">
                <input id="email" name="email" type="email" className="" />
            </div>
        </div>
    )
}

function LastName() {
    return (
        <div className="">
            <label htmlFor="last-name" className="title-category"> Last name </label>
            <div className="">
                <input id="last-name" name="last-name" type="text" className="" required />
            </div>
        </div>
    )
}

function FirstName() {
    return (
        <div className="">
            <label htmlFor="first-name" className="title-category"> First name </label>
            <div className="">
                <input id="first-name" name="first-name" type="text" className="" />
            </div>
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
            <Dropdown value={selectedGender} onChange={(e: DropdownChangeEvent) => setSelectedGender(e.value)} options={genders} optionLabel="type" placeholder="Select a gender" className="w-full md:w-14rem" />
        </div>
    )
}

function Work() {
    return (
        <div>
            <label htmlFor="work" className="title-category"> Work </label>
            <div className="input">
                <input required id="manager" type="radio" value="manager" name="work" className="marging-bottom" />
                <label htmlFor="manager" className="padding-left"> Agency Manager </label>
                <input required id="coach" type="radio" value="coach" name="work" className="marging-bottom" />
                <label htmlFor="coach" className="padding-left"> Coach (Employee) </label>
            </div>
        </div>
    )
}
