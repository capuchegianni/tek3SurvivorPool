'use client';

import React, { useState } from "react";
import './navbar.css';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import Link from 'next/link';

export default function Navbar({ activePage }: { activePage: string }) {
    const [imgSrc, setImgSrc] = useState("france.png");

    const startContent = (
        <React.Fragment>
            <label className="title"> Soul Connection </label>
        </React.Fragment>
    );

    const centerContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <Link href="/dashboard" className={`nav-link ${activePage === 'dashboard' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Dashboard</Button>
            </Link>
            <Link href="/coaches" className={`nav-link ${activePage === 'coaches' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Coaches</Button>
            </Link>
            <Link href="/customers" className={`nav-link ${activePage === 'customers' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Customers</Button>
            </Link>
            <Link href="/tips" className={`nav-link ${activePage === 'tips' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Tips</Button>
            </Link>
            <Link href="/events" className={`nav-link ${activePage === 'events' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Events</Button>
            </Link>
            <Link href="/compatibility" className={`nav-link ${activePage === 'compatibility' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Compatibility</Button>
            </Link>
            <Link href="/wardrobe" className={`nav-link ${activePage === 'wardrobe' ? 'active-link' : ''}`}>
                <Button className="p-button-text p-button-plain">Wardrobe</Button>
            </Link>
        </div>
    );

    const handleClick = () => {
        setImgSrc(prevSrc => prevSrc === "france.png" ? "usa.png" : "france.png");
    };

    const endContent = (
        <React.Fragment>
            <Button icon="pi pi-comments" className="p-button-rounded p-mr-2 icons-color" />
            <img className="language-flag p-button-rounded p-mr-2" src={imgSrc} onClick={handleClick} />
            <Button icon="pi pi-user" className="p-button-rounded p-mr-2 icons-color" />
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} center={centerContent} end={endContent} />
        </div>
    )
}