'use client';

import React from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Wardrobe() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="wardrobe"/>
            </div>
        </LoadingComponent>
    )
}
