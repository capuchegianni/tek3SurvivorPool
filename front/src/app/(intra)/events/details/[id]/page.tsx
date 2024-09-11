'use client';
import 'leaflet/dist/leaflet.css';

import React, { useState, useEffect } from "react";
import { Event } from "@/app/types/Event";
import GetEmployeesService from "@/app/services/employees/get-employees";
import { useParams } from "next/navigation";
import { Button } from 'primereact/button';
import Link from 'next/link';
import FetchError from "@/app/types/FetchErrors";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple, Icon } from "leaflet";

const getEmployeesService = new GetEmployeesService()

export default function ProfileId() {
    const { id } = useParams<{ id: string }>();
    const [eventData, setEventData] = useState<Event | null>(null);
    const [responsible, setResponsible] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const event = await getEmployeesService.getEventByID({ event_id: Number(id) }).catch(error => {
                    console.error(error);
                    return null;
                });

                const employee = await getEmployeesService.getEmployee({ id: event?.employee_id ?? 0 }).catch(error => {
                    console.error(error);
                    return null;
                });

                const employeeFullName = `${employee?.name} ${employee?.surname}`;
                setResponsible(employeeFullName);
                setEventData(event);
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }

        fetchEvents();
    }, [id]);

    return (
        <div className="flex flex-col m-6">
            <div className="flex justify-between">
                <div className="text-3xl sm:text-4xl font-bold mb-6">
                    <p> { eventData?.name } </p>
                </div>
                <Link href="/events" >
                    <Button label="return" icon="pi pi-arrow-left" className="h-10" />
                </Link>
            </div>
            <div className="flex flex-grow h-full md:flex-row flex-col">
                <div className="flex-grow bg-white h-full md:max-w-lg mr-4 border-2 rounded-md">
                    <div className="flex flex-col justify-center items-center text-center text-xl font-bold p-6 border-b-2">
                        <p> Event Name </p>
                    </div>
                    <div className="flex flex-row justify-around items-center text-center border-b-2 p-6">
                        <div>
                            <p className="text-lg font-bold">
                                { eventData?.date.split('-').reverse().join('-') }
                            </p>
                            <p> Start </p>
                            <p> Date </p>
                        </div>
                        <div>
                            <p className="text-lg font-bold"> { ((eventData?.duration ?? 0) / 60) } h </p>
                            <p> Event </p>
                            <p> Duration </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-left p-6">
                        <p className="text-lg text-gray-400 font-bold"> Short details </p>
                        <ShortDetails name="Event ID:" value={eventData?.id} />
                        <ShortDetails name="Location:" value={eventData?.location_name} />
                        <ShortDetails name="Max participant:" value={eventData?.max_participants} />
                        <ShortDetails name="Type:" value={eventData?.type} />
                        <ShortDetails name="Responsible:" value={responsible} />
                    </div>
                </div>
                <div className="flex-grow bg-white h-full border-2 rounded-md">
                    <MapWithEvent location_x={eventData?.location_x} location_y={eventData?.location_y} />
                </div>
            </div>
        </div>
    )
}

const ShortDetails = ({ name, value }: { name: string, value: string | number | undefined | null }) => {
    return (
        <div className="p-2">
            <p className="text-sm text-gray-400"> { name } </p>
            <p className="text-sm"> { value } </p>
        </div>
    )
}

const customIcon = new Icon({
    iconUrl: '/map-icon.png',
    iconSize: [60, 60],
});

const MapWithEvent = ({ location_x, location_y }: { location_x: string | undefined, location_y: string | undefined }) => {
    if (!location_x || !location_y) {
        return null;
    }

    const position: LatLngTuple = [Number(location_x), Number(location_y)];

    return (
        <div>
            <MapContainer center={position} zoom={13} style={{ height: "70vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[...position]} icon={customIcon}>
                    <Popup>
                        {location_x}, {location_y}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
