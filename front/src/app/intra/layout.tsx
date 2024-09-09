import React from "react";
import Navbar from "../navbar/navbar";

export default function IntraLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <Navbar />
            {children}
        </section>
    )
}