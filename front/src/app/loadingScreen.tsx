'use client';

import React, { useState, useEffect } from "react";

export default function LoadingComponent({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [200]);

    if (isLoading) {
        return <div className="loading-screen">Loading...</div>;
    }

    return children;
}