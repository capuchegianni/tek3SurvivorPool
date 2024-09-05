'use client';

import React, { useEffect, useState } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";
import { Knob } from 'primereact/knob';
import './compatibility.css';
import { Button } from 'primereact/button';

type FakeDBType = { name: string; sign: string; code: string; };

const fakeDB = [
    { name: 'Sacha', sign: 'Gemini', code: 'gemini' },
    { name: 'Gianni', sign: 'Leo', code: 'leo' },
    { name: 'Augustin', sign: 'Sagitarus', code: 'sagitarus' },
    { name: 'Elouan', sign: 'Pisces', code: 'pisces' },
];

const compatibility = [
    { name: 'pisces', value: 35 },
    { name: 'gemini', value: 50 },
    { name: 'leo', value: 28 },
    { name: 'sagitarus', value: 42 },
    { name: 'cancer', value: 49 },
    { name: 'virgo', value: 12 },
    { name: 'libra', value: 19 },
    { name: 'scorpio', value: 8 },
    { name: 'capricorn', value: 23 },
    { name: 'aquarius', value: 11 },
    { name: 'aries', value: 29 },
    { name: 'taurus', value: 38 },
];

export default function Compatibility() {
    const [selectedSigns, setSelectedSigns] = useState<{ sign1?: string, sign2?: string }>({});
    const [totalValue, setTotalValue] = useState<number>(0);

    const calculateTotalValue = () => {
        let total = 0;
        if (selectedSigns.sign1) {
            const sign1Value = compatibility.find(item => item.name === selectedSigns.sign1)?.value || 0;
            total += sign1Value;
        }
        if (selectedSigns.sign2) {
            const sign2Value = compatibility.find(item => item.name === selectedSigns.sign2)?.value || 0;
            total += sign2Value;
        }
        setTotalValue(total);
    }

    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="compatibility"/>
            </div>
            <CompatibilityWheel percentage={totalValue}/>
            <div className='calculation'>
                <Button label="Calculate" className="p-button-raised p-button-rounded" onClick={() => {calculateTotalValue(); CalculationAnimation();}} disabled={!selectedSigns.sign1 || !selectedSigns.sign2} />
            </div>
            <div className="caroussel">
                <ClientAstrological index={1} onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign}))} />
                <ClientAstrological index={2} onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign}))} />
            </div>
        </LoadingComponent>
    )
}

function CalculationAnimation() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
}

function ClientAstrological({ onSignSelected, index }: { onSignSelected: (sign: string, index: number) => void, index: number }) {
    const [selectedName, setSelectedName] = useState(null);
    const [filteredName, setFilteredName] = useState<FakeDBType[]>([]);

    useEffect(() => {
        if (selectedName) {
            onSignSelected((selectedName as FakeDBType).code, index);
        }
    }, [selectedName]);

    const searchItems = (event: { query: any; }) => {
        let query = event.query;
        let _filteredItems = [];

        for (let i = 0; i < fakeDB.length; i++) {
            let item = fakeDB[i];
            if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                _filteredItems.push(item);
            }
        }
        setFilteredName(_filteredItems);
    }

    const itemTemplate = (item: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
        return (
            <div>
                {item.name} - {item.code}
            </div>
        );
    }

    return (
        <div>
            <AutoComplete value={selectedName} suggestions={filteredName} completeMethod={searchItems} itemTemplate={itemTemplate} virtualScrollerOptions={{ itemSize: 38 }} field="name" dropdown onChange={(e) => setSelectedName(e.value)} />
            {selectedName && <div className='astrological-title'>{(selectedName as FakeDBType).code}</div>}
        </div>
    )
}

function CompatibilityWheel({ percentage }: { percentage: number }) {
    const [value, setValue] = useState(percentage || 0);

    useEffect(() => {
        setValue(percentage);
    }, [percentage]);

    return (
        <div className="compatibility-wheel">
            <Knob value={value} onChange={(e) => setValue(e.value)} valueTemplate={'{value}%'} readOnly />
        </div>
    )
}
