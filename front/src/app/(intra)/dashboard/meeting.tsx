'use client';

import React, { useState, useEffect } from "react";

import { Chart } from 'primereact/chart';
import { SelectButton } from "primereact/selectbutton";
import { subDays, format } from 'date-fns';

import GetEmployeesService from "@/app/services/employees/get-employees";
import { Event } from "@/app/types/Event";
import FetchError from "@/app/types/FetchErrors";

const getEmployeesService = new GetEmployeesService()

interface JustifyOption {
    date: string;
    code: string;
}

export default function MeetingSources() {
    return (
        <div className="bg-white ml-6 mt-12 rounded-md flex-grow w-full lg:w-1/4">
            <div className="text-2xl m-12">
                <MeetingInfo />
            </div>
        </div>
    )
}

const SetDate = ({ selectedTime, setSelectedTime }: { selectedTime: JustifyOption, setSelectedTime: (value: JustifyOption) => void }) => {
    const justifyOptions: JustifyOption[] = [
        {date: '3 M', code: '3M'},
        {date: '6 M', code: '6M'},
        {date: '1 Y', code: '1Y'}
    ];
    const justifyTemplate = (option: JustifyOption) => {
        return <span className="text-xs">{option.date}</span>;
    }

    return (
        <div className="text-2xl flex justify-between">
            <SelectButton value={selectedTime} onChange={(e) => setSelectedTime(e.value)} itemTemplate={justifyTemplate} optionLabel="value" options={justifyOptions} />
        </div>
    )
}

const convertTimelapsedToDays = (timelapsed: string) => {
    switch(timelapsed) {
        case '3M':
            return 90;
        case '6M':
            return 180;
        case '1Y':
            return 365;
        default:
            return 90;
    }
}

function MeetingInfo() {
    const [value, setValue] = useState<JustifyOption>({ date: '1 Y', code: '1Y' });
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        const getEvents = async () => {
            try {
                const events = await getEmployeesService.getAllEvents()

                setEvents(events)
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
                else
                    console.error(error)
            }
        }
        getEvents()
    }, []);

    const filterEventsInTimelapse = (timelapse: string) => {
        const days = convertTimelapsedToDays(timelapse);
        const cutoffDate = subDays(new Date(), days);
        return events.filter(event => new Date(event.date) >= cutoffDate);
    };

    const filteredEvents = filterEventsInTimelapse(value.code);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-2xl"> Meetings types </div>
                    <div className="text-gray-500 text-sm"> The types of meetings people go to. </div>
                </div>
                <SetDate selectedTime={value} setSelectedTime={setValue} />
            </div>
            <MeetingChart events={filteredEvents} />
        </div>
    )
}

function MeetingChart({ events }: { events: Event[] }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const sortedEvents = [...events].sort((a, b) => b.max_participants - a.max_participants)
        const biggestEvents = sortedEvents.slice(0, 15);
        const labels = biggestEvents.map(event => event.type);
        const data = biggestEvents.map(event => event.max_participants);

        const chartData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-600'),
                        documentStyle.getPropertyValue('--blue-200'),
                        documentStyle.getPropertyValue('--green-600'),
                        documentStyle.getPropertyValue('--green-200'),
                        documentStyle.getPropertyValue('--blue-600'),
                        documentStyle.getPropertyValue('--blue-200'),
                        documentStyle.getPropertyValue('--red-600'),
                        documentStyle.getPropertyValue('--red-200'),
                        documentStyle.getPropertyValue('--yellow-600'),
                        documentStyle.getPropertyValue('--yellow-200')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--blue-100'),
                        documentStyle.getPropertyValue('--green-500'),
                        documentStyle.getPropertyValue('--green-100'),
                        documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--blue-100'),
                        documentStyle.getPropertyValue('--red-500'),
                        documentStyle.getPropertyValue('--red-100'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--yellow-100')
                    ]
                }
            ]
        };

        setChartData(chartData);
    }, [events]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="pt-7 flex justify-center">
            <Chart type="doughnut" data={chartData} options={chartOptions} style={{ height: '50vh' }} />
        </div>
    )
}
