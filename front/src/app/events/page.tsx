'use client';

import React from "react";
import Navbar from "../navbar/navbar";
import LoadingComponent from "../loading";

export default function Events() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="events"/>
            </div>
        </LoadingComponent>
    )
}
