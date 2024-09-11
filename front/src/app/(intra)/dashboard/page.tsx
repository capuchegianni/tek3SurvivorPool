'use client';

import React, { useState } from "react";

import { Dropdown } from 'primereact/dropdown';
import EventsRecap from "./events";
import CustomersOverview from "./customersOverview";
import MeetingSources from "./meeting";

export default function Dashboard() {
    return (
        <div className="m-2">
            <div className="text-4xl font-light mt-6 ml-6"> Dashboard </div>
            <div className="flex justify-between">
                <div className="text-l font-light ml-6"> Welcome!</div>
            </div>
            <div className="flex flex-wrap lg:flex-row flex-col">
                <CustomersOverview />
                <MeetingSources />
                <EventsRecap />
            </div>
        </div>
    )
}
