'use client';

import React, { useState, useEffect } from "react";
import './dashboard.css';
import { Chart } from 'primereact/chart';

import CustomersService from '../../services/customers';
import { CustomerDTO } from '../../types/Customer'

const customerService = new CustomersService()

interface StatisticsProps {
    title: string;
    number: number;
}

export default function CustomersOverview({ selectedTime }: any) {
    return (
        <div className="card-customers">
            <div className="customers">
                <CustomersInfo />
            </div>
        </div>
    )
}

function CustomersInfo() {
    const [customers, setCustomers] = useState<CustomerDTO[]>([])

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setCustomers(await customerService.getCustomers())
            } catch (error) { }
        }
        getCustomers()
    }, []);

    return (
        <div>
            <div className="title-info second-line">
                Customers Overview
            </div>
            <div className="subtitle-info"> Statistics about all the clients. </div>
            <div className="second-line move-bot stat-middle">
                <Statistics title="Total customers" number={customers.length} />
            </div>
            <StatisticsGraph customers={customers}/>
        </div>
    )
}

function StatisticsGraph({ customers }: { customers: CustomerDTO[] }) {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchCustomers = async () => {
            const genders = { Male: 0, Female: 0, Other: 0 };

            const promises = customers.map(customer =>
                customerService.getCustomer({ id: customer.id }).catch(error => {
                    console.error(error);
                    return null;
                })
            );

            const results = await Promise.all(promises);

            for (let result of results)
                if (result && result.gender in genders)
                    genders[result.gender as 'Male' | 'Female' | 'Other']++;

            const data = {
                labels: Object.keys(genders),
                datasets: [
                    {
                        label: 'Genders',
                        data: Object.values(genders),
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 159, 64)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)'
                        ],
                        borderWidth: 1
                    }
                ]
            };
            setChartData(data);
        };

        fetchCustomers();
    }, [customers]);

    return (
        <div className="card">
            <Chart type="bar" data={chartData} />
        </div>
    )
}

function Statistics({ title, number }: StatisticsProps) {
    return (
        <div>
            <div className="subtitle-info">{title}</div>
            <div className="number">{number}</div>
        </div>
    )
}
