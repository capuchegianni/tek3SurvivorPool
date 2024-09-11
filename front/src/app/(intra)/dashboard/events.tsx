'use client';

import React, { useState, useEffect } from "react";

import { Chart } from 'primereact/chart';
import { subDays, format } from 'date-fns';

import GetEmployeesService from "@/app/services/employees/get-employees";
import { Event } from "@/app/types/Event";
import FetchError from "@/app/types/FetchErrors";
import { SelectButton } from "primereact/selectbutton";

const getEmployeesService = new GetEmployeesService()

interface JustifyOption {
    date: string;
    code: string;
}

interface StatisticsProps {
    title: string;
    eventsCount: number
}

interface StatisticsGraphProps {
    timelapsed: string;
    events: Event[];
}

export default function EventsRecap() {
    return (
        <div className="w-full bg-white ml-6 mt-12 rounded-md">
            <div className="text-2xl m-12 h-full">
                <EventsInfo />
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

function EventsInfo() {
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

    const countEventsInTimelapse = (timelapse: string) => {
        const days = convertTimelapsedToDays(timelapse);
        const cutoffDate = subDays(new Date(), days);
        return events.filter(event => new Date(event.date) >= cutoffDate).length;
    };

    const threeMonths = countEventsInTimelapse('3M');
    const sixMonths = countEventsInTimelapse('6M');
    const oneYear = countEventsInTimelapse('1Y');

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex flex-col">
                    <div className="text-2xl"> Events </div>
                    <div className="text-gray-500 text-sm"> The number of participants of each events on each days. </div>
                </div>
                <SetDate selectedTime={value} setSelectedTime={setValue} />
            </div>
            <div className="flex justify-between pt-12">
                <Statistics title="3 months" eventsCount={threeMonths} />
                <Statistics title="6 month" eventsCount={sixMonths} />
                <Statistics title="1 year" eventsCount={oneYear} />
            </div>
            <div className="h-full">
                <StatisticsEvent timelapsed={value ? value.code : ''} events={events}/>
            </div>
        </div>
    )
}

const groupEventsByDate = (events: Event[]) => {
    return events.reduce((acc, event) => {
        const date = format(new Date(event.date), 'MM/dd/yyyy');
        if (!acc[date])
            acc[date] = 0;
        acc[date] += event.max_participants;
        return acc;
    }, {} as Record<string, number>);
};

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

const generateChartData = (timelapse: string, events: Event[]) => {
    const days = convertTimelapsedToDays(timelapse);
    const labels = [];
    const data = [];
    const groupedEvents = groupEventsByDate(events);

    for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), i), 'MM/dd/yyyy');
        labels.unshift(date);
        data.unshift(groupedEvents[date] || 0);
    }

    return {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Number of clients',
                backgroundColor: '#9CA5FF',
                data
            }
        ]
    };
};

function StatisticsEvent({ timelapsed, events }: StatisticsGraphProps) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const data = generateChartData(timelapsed, events);
        setChartData(data);
    }, [timelapsed, events]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        }
    };

    return (
        <div className="w-full h-full">
            <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '52vh' }}/>
        </div>
    );
}

function Statistics({ title, eventsCount }: StatisticsProps) {
    return (
        <div>
            <div className="text-gray-500 text-sm flex justify-center">{title}</div>
            <div className="flex justify-center text-l pt-2">{eventsCount}</div>
        </div>
    )
}
