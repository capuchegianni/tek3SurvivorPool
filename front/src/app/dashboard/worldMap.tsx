'use client';

import React, { useState, useEffect } from "react";
import { SelectButton } from 'primereact/selectbutton';

interface JustifyOption {
    date: string;
    code: string;
}

declare global {
    interface Window {
      google: any;
    }
}

let days7db = [
    { Country: 'Germany', 'Clients number': 8 },
    { Country: 'United States', 'Clients number': 18 },
    { Country: 'Brazil', 'Clients number': 45 },
    { Country: 'Canada', 'Clients number': 29 },
    { Country: 'France', 'Clients number': 70 },
    { Country: 'RU', 'Clients number': 13 },
];

let days30db = [
    { Country: 'Germany', 'Clients number': 34 },
    { Country: 'United States', 'Clients number': 57 },
    { Country: 'Brazil', 'Clients number': 186 },
    { Country: 'Canada', 'Clients number': 131 },
    { Country: 'France', 'Clients number': 256 },
    { Country: 'RU', 'Clients number': 52 },
];

let days90db = [
    { Country: 'Germany', 'Clients number': 98 },
    { Country: 'United States', 'Clients number': 173 },
    { Country: 'Brazil', 'Clients number': 273 },
    { Country: 'Canada', 'Clients number': 379 },
    { Country: 'France', 'Clients number': 856 },
    { Country: 'RU', 'Clients number': 120 },
];

export default function WorldMap({ selectedTime }: any) {
    return (
        <div className="card-customers">
            <div className="customers">
                <MapInfo selectedTime={selectedTime} />
            </div>
        </div>
    )
}

function MapInfo({ selectedTime }: any) {
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
                Customers by Country
                <SelectButton className="" value={value} onChange={(e) => setValue(e.value)} itemTemplate={justifyTemplate} optionLabel="value" options={justifyOptions} />
            </div>
            <GeoChart selectedTime={value ? value.code : '7D'} />
        </div>
    )
}

function getDataForSelectedTime(selectedTime: string) {
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

class GeoChart extends React.Component<{selectedTime: string}> {
    componentDidMount() {
        if (typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.async = true;
            script.onload = () => {
                window.google.charts.load('current', {
                    packages: ['geochart'],
                });
                window.google.charts.setOnLoadCallback(this.drawRegionsMap);
            };
            document.body.appendChild(script);
        }
    }

    componentDidUpdate(prevProps: {selectedTime: string}) {
        if (prevProps.selectedTime !== this.props.selectedTime) {
            this.drawRegionsMap();
        }
    }

    drawRegionsMap = () => {
        const dataForSelectedTime = getDataForSelectedTime(this.props.selectedTime);
        let data = window.google.visualization.arrayToDataTable([
            ['Country', 'Clients number'],
            ...dataForSelectedTime.map(obj => [obj.Country, obj['Clients number']])
        ]);

        let options = {
            colorAxis: { colors: ['#2622E8'] }
        };

        let chart = new window.google.visualization.GeoChart(
            document.getElementById('regions_div')
        );

        chart.draw(data, options);
    };

    render() {
        return <div id="regions_div" style={{ width: '900px', height: '500px' }}></div>;
    }
}
