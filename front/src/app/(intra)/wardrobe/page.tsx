'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image'

import { Carousel } from "primereact/carousel";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import { Clothe } from "@/app/types/Clothe";
import GetCustomersService from "@/app/services/customers/get-customers";
import PostCustomersService from "@/app/services/customers/post-customers";
import { Customer } from "@/app/types/Customer";
import FetchError from "@/app/types/FetchErrors";

const getCustomersService = new GetCustomersService()
const postCustomersService = new PostCustomersService()

export default function Wardrobe() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [saveState, setSaveState] = useState(true)
    const [clothes, setClothes] = useState<Clothe[]>([])
    const [selectedClothes, setSelectedClothes] = useState<Clothe[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    useEffect(() => {
        const getCustomers = async () => {
            try {
                setCustomers(await getCustomersService.getCustomers())
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
            }
        }
        getCustomers()
    }, [])

    const getRightImages = (type: 'hat/cap' | 'top' | 'bottom' | 'shoes'): Clothe[] => {
        return clothes.filter(clothe => clothe.type === type)
    }

    const onClick = async () => {
        // Not implemented
    }

    return (
        <div>
            <div className="flex flex-col p-4 items-center">
                <h3 className="text-4xl font-bold mb-4">Customer Clothes</h3>
                <div className="flex items-center space-x-4 mb-4">
                    <GetCustomerClothes
                        customers={customers}
                        setSaveState={setSaveState}
                        setClothes={setClothes}
                        selectedCustomer={selectedCustomer}
                        setSelectedCustomer={setSelectedCustomer}
                    />
                    <Button
                        className="flex-row"
                        label="Save"
                        disabled={saveState}
                        onClick={onClick}
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full items-center">
                    <div className="flex flex-col w-1/2">
                        <SelectedClothe clothes={getRightImages('hat/cap')} selectedClothes={selectedClothes} setSelectedClothes={setSelectedClothes} type='Hat/Cap' typeAsNum={0} />
                        <SelectedClothe clothes={getRightImages('top')} selectedClothes={selectedClothes} setSelectedClothes={setSelectedClothes} type='Top' typeAsNum={1} />
                    </div>
                    <div className="flex flex-col w-1/2 items-center">
                        <SelectedClothe clothes={getRightImages('bottom')} selectedClothes={selectedClothes} setSelectedClothes={setSelectedClothes} type='Bottom' typeAsNum={2} />
                        <SelectedClothe clothes={getRightImages('shoes')} selectedClothes={selectedClothes} setSelectedClothes={setSelectedClothes} type='Shoes' typeAsNum={3} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const GetCustomerClothes = ({ customers, setSaveState, setClothes, selectedCustomer, setSelectedCustomer }: { customers: Customer[], setSaveState: (value: boolean) => void, setClothes: (value: Clothe[]) => void, selectedCustomer: Customer | null, setSelectedCustomer: (value: Customer | null) => void }) => {
    useEffect(() => {
        const getCustomerClothes = async () => {
            if (!selectedCustomer || !selectedCustomer.id) {
                setSaveState(true)
                return
            }
            try {
                setClothes(await getCustomersService.getCustomerClothes({ id: selectedCustomer.id }))
                setSaveState(false)
            } catch (error) {
                if (error instanceof FetchError)
                    error.logError()
                setSaveState(true)
            }
        }
        getCustomerClothes()
    }, [selectedCustomer, setSaveState, setClothes])

    const itemTemplate = (item: Customer) => (
        <div>
            {item.id} - {item.name} {item.surname}
        </div>
    )

    const valueTemplate = (item: Customer | null | undefined) => {
        if (item)
            return (
                <div>
                    {item.id} - {item.name} {item.surname}
                </div>
            )
        return <span>Choose a customer</span>
    }

    return (
        <div>
            <Dropdown
                inputId='customer'
                placeholder='Choose a customer'
                options={customers}
                value={selectedCustomer}
                itemTemplate={itemTemplate}
                valueTemplate={valueTemplate}
                onChange={(e) => setSelectedCustomer(e.value)}
                showClear={true}
            />
        </div>
    )
}

const SelectedClothe = ({ clothes, selectedClothes, setSelectedClothes, type, typeAsNum }: { clothes: Clothe[], selectedClothes: Clothe[], setSelectedClothes: (value: Clothe[]) => void, type: string, typeAsNum: number }) => {
    const [currentPage, setCurrentPage] = useState<number>(0)

    const clothesWithRightLink: Clothe[] = clothes.map(clothe => ({
        id: clothe.id,
        type: clothe.type,
        image: `data:image/jpeg;base64,${clothe.image}`
    }))

    const clotheTemplate = (clothe: Clothe) => {
        return (
            <div className="flex justify-center items-center relative aspect-w-1 aspect-h-1">
                <Image
                    src={clothesWithRightLink.find(clotheTemp => clotheTemp.id === clothe.id)!.image}
                    alt={clothe.type}
                    width={0}
                    height={0}
                    style={{ width: 'auto', height: '200px' }}
                />
            </div>
        );
    }

    const onPageChange = (e: { page: number }) => {
        const updatedSelectedClothes = [...selectedClothes];
        updatedSelectedClothes[typeAsNum] = clothes[e.page];
        setSelectedClothes(updatedSelectedClothes);
        setCurrentPage(e.page);
    }

    return (
        <div>
            <div className={`${clothes.length ? '' : 'hidden'} mb-4`}>
                <p className="text-xl flex justify-center text-center mb-2">{type}</p>
                <Carousel
                    value={clothes}
                    numVisible={1}
                    numScroll={1}
                    itemTemplate={clotheTemplate}
                    className="max-w-3xl mx-auto"
                    showIndicators={false}
                    page={currentPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}
