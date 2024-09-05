'use client';

import React from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Customers() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="customers"/>
            </div>
        </LoadingComponent>
    )
}
