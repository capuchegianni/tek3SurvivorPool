'use client';

import React, { useState, useEffect } from "react";
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";
import './dashboard.css';
import { Dropdown } from 'primereact/dropdown';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Chart } from 'primereact/chart';
import { subDays, format } from 'date-fns';

interface JustifyOption {
    date: string;
    code: string;
}

interface StatisticsProps {
    title: string;
    number: number;
    percentage?: number;
}

interface StatisticsGraphProps {
    timelapsed: string;
    clientNbr: any;
}

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
                <EventsRecap />
            </div>
        </LoadingComponent>
    )
}

function CustomersOverview({ selectedTime }: any) {
    return (
        <div className="card-customers">
            <div className="customers">
                <CustomersInfo selectedTime={selectedTime} />
            </div>
        </div>
    )
}

function CustomersInfo({ selectedTime }: any) {
    const [value, setValue] = useState<JustifyOption>(selectedTime);
    const justifyOptions: JustifyOption[] = [
        {date: '7 D', code: '7D'},
        {date: '1 M', code: '1M'},
        {date: '3 M', code: '3M'}
    ];

    const justifyTemplate = (option: JustifyOption) => {
        return <span className="justifyOption">{option.date}</span>;
    }

    useEffect(() => {
        setValue(selectedTime);
    }, [selectedTime]);

    return (
        <div>
            <div className="title-info second-line">
                Customers Overview
                <SelectButton className="" value={value} onChange={(e) => setValue(e.value)} itemTemplate={justifyTemplate} optionLabel="value" options={justifyOptions} />
            </div>
            <div className="subtitle-info"> When customers have joined in the time. </div>
            <div className="second-line move-bot">
                <Statistics title="Customers" number={932} percentage={14.27} />
                <Statistics title="Doing meetings" number={28.49} percentage={-12.37} />
                <Statistics title="Customers by coach" number={34} />
            </div>
            <StatisticsGraph timelapsed={value.code} clientNbr={[520, 250, 120, 574, 978, 854, 750]}/>
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

function Statistics({ title, number, percentage = 0 }: StatisticsProps) {
    const percentageClass = percentage < 0 ? 'negative' : 'positive';
    const absolutePercentage = Math.abs(percentage);

    return (
        <div>
            <div className="subtitle-info">{title}</div>
            <div className="number">{number}</div>
            {percentage !== 0 && (
                <div className={`number ${percentageClass}`}>
                    {percentage < 0 ? <FaArrowDown /> : <FaArrowUp />}
                    {' '}
                    {`${absolutePercentage}%`}
                </div>
            )}
        </div>
    )
}

function StatisticsGraph({timelapsed, clientNbr}: StatisticsGraphProps) {
    const [chartData, setChartData] = useState({});

    const convertTimelapsedToDays = (timelapsed: string) => {
        switch(timelapsed) {
            case '7D':
                return 7;
            case '1M':
                return 30;
            case '3M':
                return 90;
            default:
                return 7;
        }
    }

    const generateLabels = (timelapse: string) => {
        const days = convertTimelapsedToDays(timelapse);
        const labels = [];
        for (let i = 0; i < days; i++) {
            const date = subDays(new Date(), i);
            labels.unshift(format(date, 'MM/dd/yyyy'));
        }
        return labels;
    }

    useEffect(() => {
        const data = {
            labels: generateLabels(timelapsed),
            datasets: [
                {
                    label: 'Number of clients',
                    data: clientNbr,
                    fill: true,
                    borderColor: '#2622E8',
                    tension: 0.4,
                    backgroundColor: 'rgba(71,68,241,0.2)'
                }
            ]
        };

        setChartData(data);
    }, [timelapsed]);

    return (
        <div className="card">
            <Chart type="line" data={chartData} options={{ scales: { y: { min: 0, max: 1200 } }, legend: {display: false} }} />
        </div>
    )
}
