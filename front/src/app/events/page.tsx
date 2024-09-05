'use client';

import React from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Events() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="events"/>
            </div>
        </LoadingComponent>
    )
}
