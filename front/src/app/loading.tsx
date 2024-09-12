'use client';

import { useEffect, useState } from 'react';
import './globals.css'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LoadingComponent() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ProgressSpinner strokeWidth='5' />
            <div className="ml-4 text-xl font-bold">Loading...</div>
        </div>
    );
}