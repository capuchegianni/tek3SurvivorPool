'use client';

import React, { useState } from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";
import './dashboard.css';
import { Dropdown } from 'primereact/dropdown';
import EventsRecap from "./events";
import CustomersOverview from "./customersOverview";
import WorldMap from "./worldMap";
import MeetingSources from "./meeting";

export default function Dashboard() {
    const time = [
        { date: '7 days', code: '7D' },
        { date: '30 days', code: '1M' },
        { date: '3 months', code: '3M' }
    ];
    const [selectedTime, setSelectedTime] = useState(time[0]);

    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="dashboard"/>
            </div>
            <div className="title-dashboard"> Dashboard </div>
            <div className="second-line">
                <div className="welcome-text"> Welcome!</div>
                <div className="title-dashboard2">
                    <Dropdown value={selectedTime} onChange={(e) => setSelectedTime(e.value)} options={time} optionLabel="date" placeholder="🗓 Select a timelapse" className="pick-date" />
                </div>
            </div>
            <div className="card-line">
                <CustomersOverview selectedTime={selectedTime}/>
                <EventsRecap selectedTime={selectedTime} />
            </div>
            <div className="card-line">
                <WorldMap selectedTime={selectedTime}/>
                <MeetingSources selectedTime={selectedTime}/>
            </div>
        </LoadingComponent>
    )
}
