'use client';

import React from "react";
import Navbar from "../navbar/navbar";
import LoadingComponent from "../loading";

export default function Customers() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="customers"/>
            </div>
        </LoadingComponent>
    )
}
