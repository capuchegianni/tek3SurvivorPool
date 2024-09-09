'use client';

import React, { useState } from "react";

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
        <div>
            <div className="text-4xl font-light mt-6 ml-6"> Dashboard </div>
            <div className="flex justify-between">
                <div className="text-l font-light ml-6"> Welcome!</div>
                <Dropdown
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.value)}
                    options={time}
                    optionLabel="date"
                    className="pick-date mr-6 border-white rounded-md" />
            </div>
            <div className="flex lg:flex-row flex-col">
                <CustomersOverview selectedTime={selectedTime}/>
                <EventsRecap selectedTime={selectedTime} />
            </div>
            <div className="flex lg:flex-row flex-col">
                <WorldMap selectedTime={selectedTime}/>
                <MeetingSources selectedTime={selectedTime}/>
            </div>
        </div>
    )
}
