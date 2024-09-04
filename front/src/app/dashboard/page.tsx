'use client';

import React, { useState } from "react";
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";
import './dashboard.css';
import { Dropdown } from 'primereact/dropdown';

interface JustifyOption {
    date: string;
    code: string;
}

export default function Dashboard() {
    const [selectedTime, setSelectedTime] = useState(null);
    const time = [
        { date: '7 days', code: '7D' },
        { date: '30 days', code: '30D' },
        { date: '3 months', code: '3D' }
    ];

    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="dashboard"/>
            </div>
            <div className="title-dashboard"> Dashboard </div>
            <div className="welcome-text"> Welcome!</div>
            <div className="title-dashboard2">
                <Dropdown value={selectedTime} onChange={(e) => setSelectedTime(e.value)} options={time} optionLabel="date" placeholder="🗓 Select a timelapse" className="pick-date" />
            </div>
            <div className="card-line">
                <CustomersOverview />
                <EventsRecap />
            </div>
        </LoadingComponent>
    )
}

function CustomersOverview() {
    return (
        <div className="card-customers">
            <div className="customers">
                <CustomersInfo />
            </div>
        </div>
    )
}

function CustomersInfo() {
    const [value, setValue] = useState<JustifyOption>({} as JustifyOption);
    const justifyOptions: JustifyOption[] = [
        {date: '7 D', code: 'left'},
        {date: '30 D', code: 'Center'},
        {date: '3 M', code: 'Justify'}
    ];

    const justifyTemplate = (option: JustifyOption) => {
        return <span>{option.date}</span>;
    }

    return (
        <div>
            <div className="title-info second-line">
                Customers Overview
                <SelectButton className="" value={value} onChange={(e) => setValue(e.value)} itemTemplate={justifyTemplate} optionLabel="value" options={justifyOptions} />
            </div>
            <div className="subtitle-info"> When customers have joined in the time. </div>
            <div className="second-line move-bot">
                <div>
                    <div className="subtitle-info">Customers</div>
                    <div>32</div>
                    <div>25</div>
                </div>
            </div>
        </div>
    )
}

function EventsRecap() {
    return (
        <div className="event-recap">
            <div className="events">
                Customers Overview
            </div>
        </div>
    )
}
