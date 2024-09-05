'use client';

import React, { useState, useEffect } from "react";
import Navbar from "../navbar";
import LoadingComponent from "../loadingScreen";

export default function Tips() {
    return (
        <LoadingComponent>
            <div className="card">
                <Navbar activePage="tips" />
            </div>
        </LoadingComponent>
    )
}
