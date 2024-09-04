'use client';

import React from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Dashboard() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="dashboard"/>
            </div>
        </LoadingComponent>
    )
}
