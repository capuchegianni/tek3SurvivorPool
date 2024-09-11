'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AutoComplete } from "primereact/autocomplete";
import { Knob } from 'primereact/knob';
import './compatibility.css';
import { Button } from 'primereact/button';
import Image from 'next/image';

import GetCustomersService from '../../services/customers/get-customers';
import { Customer, CustomerDTO } from '../../types/Customer'
import { get } from 'http';

const getCustomerService = new GetCustomersService()

const astroSigns = [
    { name: 'pisces', value: 35, image: '/poissons-astro.png' },
    { name: 'gemini', value: 50, image: '/gemeaux-astro.png' },
    { name: 'leo', value: 28, image: '/lion-astro.png' },
    { name: 'sagittarius', value: 42, image: '/sagittaire-astro.png' },
    { name: 'cancer', value: 49, image: '/cancer-astro.png' },
    { name: 'virgo', value: 12, image: '/vierge-astro.png' },
    { name: 'libra', value: 19, image: '/belier-astro.png' },
    { name: 'scorpio', value: 8, image: '/scorpion-astro.png' },
    { name: 'capricorn', value: 23, image: '/capricorne-astro.png' },
    { name: 'aquarius', value: 11, image: '/verseau-astro.png' },
    { name: 'aries', value: 29, image: '/balance-astro.png' },
    { name: 'taurus', value: 38, image: '/taureau-astro.png' },
];

interface ClientAstrologicalProps {
    onSignSelected: (sign: string, index: number) => void;
    index: number;
    customers: CustomerDTO[];
    selectedCustomers: { [key: number]: CustomerDTO | null };
    onCustomerSelect: (customer: CustomerDTO | null, index: number) => void;
}

export default function Compatibility() {
    const [selectedSigns, setSelectedSigns] = useState<{ sign1?: string, sign2?: string }>({});
    const [totalValue, setTotalValue] = useState<number>(0);
    const [customers, setCustomers] = useState<CustomerDTO[]>([])
    const [selectedCustomers, setSelectedCustomers] = useState<{ [key: number]: CustomerDTO | null }>({ 1: null, 2: null });

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setCustomers(await getCustomerService.getCustomers())
            } catch (error) { }
        }
        getCustomers()
    }, [])

    const calculateTotalValue = () => {
        if (!selectedSigns.sign1 || !selectedSigns.sign2)
            return setTotalValue(0)
        const sign1Value = astroSigns.find(item => item.name === selectedSigns.sign1)?.value || 0;
        const sign2Value = astroSigns.find(item => item.name === selectedSigns.sign2)?.value || 0;


        setTotalValue(sign1Value + sign2Value);
    }

    const handleCustomerSelect = (customer: CustomerDTO | null, index: number) => {
        setSelectedCustomers(prev => ({ ...prev, [index]: customer }))
    }

    return (
        <div>
            <div className='flex justify-center pt-5 gap-10'>
                <Button
                    label="Calculate"
                    className="button-raised button-rounded"
                    onClick={() => {calculateTotalValue(); CalculationAnimation();}}
                    disabled={!selectedSigns.sign1 || !selectedSigns.sign2}
                />
            </div>
            <div className='flex justify-around flex-wrap p-5'>
                <ClientAstrological
                    index={1}
                    onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign.toLowerCase()}))}
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    onCustomerSelect={handleCustomerSelect}
                />
                <div className='pt-8%'>
                    <CompatibilityWheel percentage={totalValue}/>
                </div>
                <ClientAstrological
                    index={2}
                    onSignSelected={(sign, index) => setSelectedSigns(prev => ({...prev, [`sign${index}`]: sign.toLowerCase()}))}
                    customers={customers}
                    selectedCustomers={selectedCustomers}
                    onCustomerSelect={handleCustomerSelect}
                />
            </div>
        </div>
    )
}

function CalculationAnimation() {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 500);
}

function ClientAstrological({
    onSignSelected,
    index,
    customers,
    selectedCustomers,
    onCustomerSelect
}: ClientAstrologicalProps) {
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDTO | null>(null);
    const [selectedFullCustomer, setSelectedFullCustomer] = useState<Customer | null>(null)
    const [customerImage, setCustomerImage] = useState<string | null>(null)
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerDTO[]>([]);
    const hasFetched = useRef<boolean>(false)
    const [oldSelectedCustomer, setOldSelectedCustomer] = useState<CustomerDTO | null>(null)

    useEffect(() => {
        const getCustomer = async () => {
            if (hasFetched.current)
                return
            try {
                const customer = await getCustomerService.getCustomer({ id: selectedCustomer!.id })
                const image = await getCustomerService.getCustomerImage({ id: selectedCustomer!.id })

                setCustomerImage(image ? `data:image/jpeg;base64,${image}` : null)
                onSignSelected(customer.astrologicalSign, index);
                getCustomerService.getCustomer({ id: selectedCustomer!.id })
                setSelectedFullCustomer(customer)
                hasFetched.current = true
            } catch (error: any) { }
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
            setCustomerImage(null)
            hasFetched.current = false
        }
    }, [selectedCustomer, onSignSelected, index, oldSelectedCustomer]);



    const searchItems = (event: { query: any; }) => {
        const query = event.query as string;
        const correspondingCustomers = customers.filter(customer => customer.name.toLowerCase().includes(query.toLowerCase()) && customer !== selectedCustomers[1] && customer !== selectedCustomers[2]);

        setFilteredCustomers(correspondingCustomers);
    }

    const itemTemplate = (item: CustomerDTO) => {
        return (
            <div>
                {item.id} - {item.name} {item.surname}
            </div>
        );
    }

    const image = astroSigns.find(sign => sign.name === selectedFullCustomer?.astrologicalSign.toLowerCase())?.image

    return (
        <div>
            <AutoComplete inputId='customer'
                placeholder='Choose a customer'
                value={selectedCustomer}
                suggestions={filteredCustomers}
                completeMethod={searchItems}
                itemTemplate={itemTemplate}
                virtualScrollerOptions={{ itemSize: 38 }}
                field="name"
                dropdown
                onChange={(e) => {
                    setSelectedCustomer(e.value)
                    onCustomerSelect(e.value, index)
                }}
            />
            <div className='text-4xl flex items-center space-x-2.5 pt-2.5 justify-around p-10%'>
                {selectedFullCustomer?.astrologicalSign}
                { image && (
                        <Image src={image} alt='sign' width={50} height={50} />

                )}
            </div>
                { customerImage && (
                    <div className="image-container">
                        <Image src={customerImage} alt='Customer' fill />
                    </div>
                )}
        </div>
    )
}

function CompatibilityWheel({ percentage }: { percentage: number }) {
    const [value, setValue] = useState(percentage || 0);

    useEffect(() => {
        setValue(percentage);
    }, [percentage]);

    return (
        <div className="flex justify-center pt-3.5">
            <Knob value={value} onChange={(e) => setValue(e.value)} valueTemplate={'{value}%'} readOnly />
        </div>
    )
}
