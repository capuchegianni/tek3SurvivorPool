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
import AddEvent from "./addEvent";
import EditEvent from "./edit";
import Swal from 'sweetalert2'

const getEmployeesService = new GetEmployeesService()

export default function Events() {
    const [events, setEvents] = useState<Event[]>([])
    const [search, setSearch] = useState<string>("");
    const [addEvent, setAddEvent] = useState(false);

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
                <Button label="Add event" className="mr-6 mt-6" icon="pi pi-plus" onClick={() => setAddEvent(true)}/>
            </div>
            {addEvent && <AddEvent onClose={() => setAddEvent(false)}/>}
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
                    events={events.map(event => ({ title: event.name, date: event.date, id: `${event.id}` }))}
                    eventMouseEnter={handleMouseEnter} eventMouseLeave={handleMouseLeave} />
            </div>
        </div>
    )
}

function EventList({events, setSearch}: {events: Event[], setSearch: (search: string) => void}) {
    const [selectedEmployee, setSelectedEmployee] = useState<Event | null>(null);

    const handleEventClick = (info: {originalEvent: Event | any, data: Event | any}) => {
        if (typeof window !== 'undefined') {
            window.location.href = `/events/details/${info.data.id}`;
        }
    }

    const employeeActions = (rowData: Event) => {
        const handleDelete = () => {
            Swal.fire({
                title: 'Delete: ' + rowData.name,
                text: "Are you sure you want to delete this?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Deleted coach: ', rowData.id);
                }
            })
        }

        return(
            <div>
                <Button className="bg-white rounded-3xl text-blue-400 border-blue-400" icon="pi pi-pencil" onClick={() => setSelectedEmployee(rowData)}/>
                <Button className="bg-white rounded-3xl ml-3 text-red-400 border-red-400" icon="pi pi-trash" onClick={handleDelete}/>
            </div>
        )
    }

    return (
        <div className="bg-white ml-6 mt-12 rounded mr-6 md:w-full">
            <div className="m-12">
                <div className="flex justify-between">
                    <div className="text-2xl font-light"> Events </div>
                    <InputText id="search" placeholder="search" type="text" onChange={(e) => setSearch(e.target.value)} />
                </div>
                <DataTable className="mt-6 cursor-pointer" value={events} header='Events' size="small" rows={8} paginator onRowClick={handleEventClick}>
                    <Column field="name" header="Name" className="text-xl" style={{width:'50%'}}/>
                    <Column field="date" header="Date" className="text-xl" style={{width:'30%'}}/>
                    <Column body={employeeActions} header="Actions" style={{width:'20%'}}/>
                </DataTable>
                {selectedEmployee && <EditEvent onClose={() => setSelectedEmployee(null)} currentEvent={selectedEmployee}/>}
            </div>
        </div>
    )
}
