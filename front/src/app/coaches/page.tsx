'use client';

import React from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Coaches() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="coaches"/>
            </div>
        </LoadingComponent>
    )
}
