'use client';

import React, { useState, useEffect } from "react";

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
        <div className="w-full bg-white ml-6 mt-12 rounded-md">
            <div className="text-2xl m-12">
                <EventsInfo selectedTime={selectedTime} />
            </div>
        </div>
    )
}

function EventsInfo({ selectedTime }: any) {
    const [value, setValue] = useState<JustifyOption>(selectedTime);

    useEffect(() => {
        try {
        setValue(selectedTime);
        } catch (error) { }
    }, [selectedTime]);

    return (
        <div>
            <div className="text-2xl"> Events </div>
            <div className="text-gray-500 text-sm"> Our events and their status. </div>
            <div className="flex justify-between pt-12">
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

    useEffect(() => {
        try {
            const generateLabels = (timelapse: string) => {
                const days = convertTimelapsedToDays(timelapse);
                const labels = [];
                for (let i = 0; i < days; i++) {
                    const date = subDays(new Date(), i);
                    labels.unshift(format(date, 'MM/dd/yyyy'));
                }
                return labels;
            }

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
        } catch (error) { }
    }, [timelapsed, clientNbr]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <Chart type="bar" data={chartData} options={chartOptions} style={{ height: 420 }} />
        </div>
    )
}

function Statistics({ title, number, percentage = 0 }: StatisticsProps) {
    const percentageClass = percentage < 0 ? 'text-red-600' : 'text-green-600';
    const absolutePercentage = Math.abs(percentage);

    return (
        <div>
            <div className="text-gray-500 text-sm flex justify-center">{title}</div>
            <div className="flex justify-center text-l pt-2">{number}</div>
            {percentage !== 0 && (
                <div className={`flex justify-center text-l pt-2 ${percentageClass}`}>
                    {percentage < 0 ? <FaArrowDown /> : <FaArrowUp />}
                    {' '}
                    {`${absolutePercentage}%`}
                </div>
            )}
        </div>
    )
}
