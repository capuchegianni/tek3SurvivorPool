'use client';

import React, { useState, useEffect } from "react";

import { Chart } from 'primereact/chart';

import GetCustomersService from '../../services/customers/get-customers';
import { Customer } from '../../types/Customer'
import FetchError from "@/app/types/FetchErrors";

const getCustomerService = new GetCustomersService()

interface StatisticsProps {
    title: string;
    number: number;
}

export default function CustomersOverview() {
    return (
        <div className="bg-white ml-6 mt-12 rounded flex-grow w-full lg:w-1/4">
            <div className="m-12">
                <CustomersInfo />
            </div>
        </div>
    )
}

function CustomersInfo() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const genders = { Male: 0, Female: 0, Other: 0 };
                const fetchedCustomers = await getCustomerService.getCustomers()

                setCustomers(fetchedCustomers)
                for (const customer of fetchedCustomers)
                    if (customer.gender in genders)
                        genders[customer.gender as 'Male' | 'Female' | 'Other']++;

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
                setChartData(data)
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError
                else
                    console.error(error)
            }
        }
        getCustomers()
    }, []);

    return (
        <div>
            <div className="text-2xl flex justify-between">
                Customers Overview
            </div>
            <div className="text-gray-500 text-sm"> Statistics about all the clients. </div>
            <div className="flex justify-center pt-12">
                <Statistics title="Total customers" number={customers.length} />
            </div>
            <StatisticsGraph chartData={chartData}/>
        </div>
    )
}

function StatisticsGraph({ chartData }: { chartData: {} }) {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div>
            <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '40vh' }} />
        </div>
    );
}

function Statistics({ title, number }: StatisticsProps) {
    return (
        <div>
            <div className="text-gray-500 text-sm">{title}</div>
            <div className="flex justify-center text-4xl pt-2 pb-6">{number}</div>
        </div>
    )
}
