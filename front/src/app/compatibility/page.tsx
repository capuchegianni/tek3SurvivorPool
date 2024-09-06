'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import Navbar from "../navbar/navbar";
import LoadingComponent from "../loading";
import { Knob } from 'primereact/knob';
import './compatibility.css';
import { Button } from 'primereact/button';

import CustomersService from '../services/customers';
import { Customer, CustomerDTO } from '../types/Customer'

const customerService = new CustomersService()

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
    const [customers, setCustomers] = useState<CustomerDTO[]>([])

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setCustomers(await customerService.getCustomers())
            } catch (error) { }
        }
        getCustomers()
    }, [])

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
                <ClientAstrological index={1} onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign.toLowerCase()}))} customers={customers} />
                <ClientAstrological index={2} onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign.toLowerCase()}))} customers={customers} />
            </div>
        </LoadingComponent>
    )
}

function CalculationAnimation() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
}

function ClientAstrological({ onSignSelected, index, customers }: { onSignSelected: (sign: string, index: number) => void, index: number, customers: CustomerDTO[] }) {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null);
    const [selectedFullCustomer, setSelectedFullCustomer] = useState<Customer | null>(null)
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerDTO[]>([]);
    const hasFetched = useRef<boolean>(false)
    const [oldSelectedCustomer, setOldSelectedCustomer] = useState<CustomerDTO | null>(null)

    useEffect(() => {
        const getCustomer = async () => {
            if (selectedCustomer?.id) {
                if (hasFetched.current)
                    return
                try {
                    const customer = await customerService.getCustomer({ id: selectedCustomer.id })

                    onSignSelected(customer.astrological_sign, index);
                    setSelectedFullCustomer(customer)
                    hasFetched.current = true
                } catch (error: any) { }
            }
        }

        if (selectedCustomer?.id) {
            getCustomer()
            if (selectedCustomer !== oldSelectedCustomer) {
                setOldSelectedCustomer(selectedCustomer)
                hasFetched.current = false
            }
        } else {
            setOldSelectedCustomer(selectedCustomer)
            setSelectedFullCustomer(null)
            hasFetched.current = false
        }
    }, [selectedCustomer, onSignSelected, index, oldSelectedCustomer]);



    const searchItems = (event: { query: any; }) => {
        const query = event.query as string;
        const correspondingCustomers = customers.filter(customer => customer.name.toLowerCase().includes(query.toLowerCase()));

        setFilteredCustomers(correspondingCustomers);
    }

    const itemTemplate = (item: CustomerDTO) => {
        return (
            <div>
                {item.id} - {item.name} {item.surname}
            </div>
        );
    }

    return (
        <div>
            <AutoComplete value={selectedCustomer} suggestions={filteredCustomers} completeMethod={searchItems} itemTemplate={itemTemplate} virtualScrollerOptions={{ itemSize: 38 }} field="name" dropdown onChange={(e) => setSelectedCustomer(e.value)} />
            {selectedCustomer && <div className='astrological-title'>{selectedFullCustomer?.astrological_sign}</div>}
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
