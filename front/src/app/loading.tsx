'use client';

import './globals.css'
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LoadingComponent() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ProgressSpinner strokeWidth='5' />
            <div className="ml-4 text-xl font-bold">Loading...</div>
        </div>
    );
}