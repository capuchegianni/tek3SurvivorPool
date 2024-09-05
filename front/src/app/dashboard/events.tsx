'use client';

import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Chart } from 'primereact/chart';
import { subDays, format } from 'date-fns';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

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

export default function EventsRecap({ selectedTime }: any) {
    return (
        <div className="event-recap">
            <div className="title-info customers">
                <EventsInfo selectedTime={selectedTime} />
            </div>
        </div>
    )
}

function EventsInfo({ selectedTime }: any) {
    const [value, setValue] = useState<JustifyOption>(selectedTime);

    useEffect(() => {
        setValue(selectedTime);
    }, [selectedTime]);

    return (
        <div>
            <div className="title-info"> Events </div>
            <div className="subtitle-info"> Our events and their status. </div>
            <div className="second-line move-bot">
                <Statistics title="Monthly" number={83} percentage={4.63} />
                <Statistics title="Weekly" number={20} percentage={-1.92} />
                <Statistics title="Daily (avg)" number={3} percentage={3.45} />
            </div>
            <StatisticsEvent timelapsed={value ? value.code : ''} clientNbr={[520, 250, 120, 574, 978, 854, 750]}/>
        </div>
    )
}

function StatisticsEvent({timelapsed, clientNbr}: StatisticsGraphProps) {
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
                    type: 'bar',
                    label: 'Number of client',
                    backgroundColor: '#9CA5FF',
                    data: clientNbr
                }
            ]
        };

        setChartData(data);
    }, [timelapsed]);

    return (
        <div className="card card-space">
            <Chart type="bar" data={chartData} />
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
