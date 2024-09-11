'use client';

import { Button } from "primereact/button";
import React from "react";

export default function Events() {
    return (
        <div>
            <div className="flex justify-between">
                <div className="text-4xl font-light mt-6 ml-6"> Events </div>
                <Button label="Add event" className="mr-6 mt-6" icon="pi pi-plus" />
            </div>
            <div className="flex lg:flex-row flex-col">
                <Calendar />
            </div>
        </div>
    )
}

function Calendar() {
    return (
        <div className="bg-white ml-6 mt-12 rounded mr-6 w-full">
            <div className="m-12">
                Test
            </div>
        </div>
    )
}
