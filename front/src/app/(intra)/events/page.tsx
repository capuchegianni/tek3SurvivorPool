'use client';

import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import GetEmployeesService from "@/app/services/employees/get-employees";
import { Event } from "@/app/types/Event";
import FetchError from "@/app/types/FetchErrors";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

const getEmployeesService = new GetEmployeesService()

export default function Events() {
    const [events, setEvents] = useState<Event[]>([])
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const getEvents = async () => {
            try {
                setEvents(await getEmployeesService.getAllEvents())
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }
        getEvents();
    }, [])

    return (
        <div>
            <div className="flex justify-between">
                <div className="text-4xl font-light mt-6 ml-6"> Events </div>
                <Button label="Add event" className="mr-6 mt-6" icon="pi pi-plus" />
            </div>
            <div className="flex lg:flex-row flex-col">
                <Calendar events={events.filter(event => event.name.includes(search) || event.date.includes(search))}/>
                <EventList events={events.filter(event => event.name.includes(search) || event.date.includes(search))} setSearch={setSearch}/>
            </div>
        </div>
    )
}

function Calendar({events}: {events: Event[]}) {
    const handleEventClick = (info: any) => {
        if (typeof window !== 'undefined') {
            window.location.href = `/events/details/${info.event.id}`;
        }
    }

    const handleMouseEnter = (info: any) => {
        info.el.style.cursor = 'pointer';
    }

    const handleMouseLeave = (info: any) => {
        info.el.style.cursor = '';
    }

    return (
        <div className="bg-white ml-6 mt-12 rounded mr-6 w-full" >
            <div className="m-12">
                <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" eventClick={handleEventClick}
                    events={events.map(event => ({ title: event.name, date: event.date, id: `event-${event.id}` }))}
                    eventMouseEnter={handleMouseEnter} eventMouseLeave={handleMouseLeave} />
            </div>
        </div>
    )
}

function EventList({events, setSearch}: {events: Event[], setSearch: (search: string) => void}) {
    const handleEventClick = (info: {originalEvent: Event | any, data: Event | any}) => {
        if (typeof window !== 'undefined') {
            window.location.href = `/events/details/${info.data.id}`;
        }
    }

    return (
        <div className="bg-white ml-6 mt-12 rounded mr-6 w-1/2">
            <div className="m-12">
                <div className="flex justify-between">
                    <div className="text-2xl font-light"> Events </div>
                    <InputText id="search" placeholder="search" type="text" onChange={(e) => setSearch(e.target.value)} />
                </div>
                <DataTable className="mt-6 cursor-pointer" value={events} header='Events' size="small" rows={15} paginator onRowClick={handleEventClick}>
                    <Column field="name" header="Name" className="text-xl" style={{width:'70%'}}/>
                    <Column field="date" header="Date" className="text-xl" style={{width:'30%'}}/>
                </DataTable>
            </div>
        </div>
    )
}
