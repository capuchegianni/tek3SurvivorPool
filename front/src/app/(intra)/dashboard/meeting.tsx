'use client';

import React, { useState, useEffect } from "react";

import { Chart } from 'primereact/chart';
import { SelectButton } from 'primereact/selectbutton';
import FetchError from "@/app/types/FetchErrors";

interface JustifyOption {
    date: string;
    code: string;
}

let days7db = [
    { Source: 'Email', 'Meetings number': 8 },
    { Source: 'Phone', 'Meetings number': 18 },
    { Source: 'In person', 'Meetings number': 45 },
    { Source: 'Social media', 'Meetings number': 29 },
    { Source: 'Other', 'Meetings number': 70 },
];

let days30db = [
    { Source: 'Email', 'Meetings number': 34 },
    { Source: 'Phone', 'Meetings number': 57 },
    { Source: 'In person', 'Meetings number': 186 },
    { Source: 'Social media', 'Meetings number': 131 },
    { Source: 'Other', 'Meetings number': 256 },
];

let days90db = [
    { Source: 'Email', 'Meetings number': 98 },
    { Source: 'Phone', 'Meetings number': 173 },
    { Source: 'In person', 'Meetings number': 273 },
    { Source: 'Social media', 'Meetings number': 379 },
    { Source: 'Other', 'Meetings number': 856 },
];

export default function MeetingSources({ selectedTime }: any) {
    return (
        <div className="w-full bg-white ml-6 mt-12 rounded-md">
            <div className="text-2xl m-12">
                <MeetingInfo selectedTime={selectedTime} />
            </div>
        </div>
    )
}

function MeetingInfo({ selectedTime }: any) {
    const [value, setValue] = useState<JustifyOption>(selectedTime);
    const justifyOptions: JustifyOption[] = [
        {date: '7 D', code: '7D'},
        {date: '1 M', code: '1M'},
        {date: '3 M', code: '3M'}
    ];

    const justifyTemplate = (option: JustifyOption) => {
        return <span className="text-xs">{option.date}</span>;
    }

    useEffect(() => {
        try {
        setValue(selectedTime);
        } catch (error) { }
    }, [selectedTime]);

    return (
        <div>
            <div className="text-2xl flex justify-between">
                Meetings top sources
                <SelectButton className="" value={value} onChange={(e) => setValue(e.value)} itemTemplate={justifyTemplate} optionLabel="value" options={justifyOptions} />
            </div>
            <MeetingChart selectedTime={value ? value.code : '7D'} />
        </div>
    )
}

function getDatabase(selectedTime: string) {
    switch (selectedTime) {
        case '7D':
            return days7db;
        case '1M':
            return days30db;
        case '3M':
            return days90db;
        default:
            return [];
    }
}

function MeetingChart({selectedTime}: {selectedTime: string}) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        try {
            const documentStyle = getComputedStyle(document.documentElement);
            const db = getDatabase(selectedTime);
            const labels = db.map(item => item.Source);
            const data = db.map(item => item['Meetings number']);

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--blue-200'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--green-600'),
                            documentStyle.getPropertyValue('--blue-800')
                        ],
                        hoverBackgroundColor: [
                            documentStyle.getPropertyValue('--blue-400'),
                            documentStyle.getPropertyValue('--blue-100'),
                            documentStyle.getPropertyValue('--green-200'),
                            documentStyle.getPropertyValue('--green-400'),
                            documentStyle.getPropertyValue('--blue-600')
                        ]
                    }
                ]
            };

            setChartData(chartData);
        } catch (error) {
            if (error instanceof FetchError)
                error.logError()
        }
    }, [selectedTime]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="pt-7 flex justify-center">
            <Chart type="doughnut" data={chartData} options={chartOptions} style={{ height: 440 }}/>
        </div>
    )
}
