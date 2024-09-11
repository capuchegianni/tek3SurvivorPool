'use client';

import React, { useState, useRef, useEffect } from "react";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image'
import Link from 'next/link';

import GetEmployeesService from "../services/employees/get-employees";
import Swal from "sweetalert2";
import FetchError from "../types/FetchErrors";

const getEmployeesService = new GetEmployeesService()

export default function Navbar() {
    const [imgSrc, setImgSrc] = useState<'/france.png' | '/usa.png'>("/france.png");
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [employeeImage, setEmployeeImage] = useState<string | null>(null)
    const op = useRef<OverlayPanel>(null);
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        const fetchEmployeeImage = async () => {
            const image = await getEmployeeImage();
            setEmployeeImage(image);
        };

        fetchEmployeeImage();
    }, []);

    const startContent = (
        <React.Fragment>
            <p className="text-3xl font-semibold"> Soul Connection </p>
        </React.Fragment>
    );

    const centerContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <Link href="/dashboard" className={`no-underline text-inherit ${pathName === '/dashboard' ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Dashboard</Button>
            </Link>
            <Link href="/coaches" className={`no-underline text-inherit ${(pathName === '/coaches' || pathName.startsWith('/profile/coach')) ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Coaches</Button>
            </Link>
            <Link href="/customers" className={`no-underline text-inherit ${(pathName === '/customers' || pathName.startsWith('/profile/customer')) ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Customers</Button>
            </Link>
            <Link href="/tips" className={`no-underline text-inherit ${pathName === '/tips' ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Tips</Button>
            </Link>
            <Link href="/events" className={`no-underline text-inherit ${(pathName === '/events' || pathName.startsWith('/events/details')) ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Events</Button>
            </Link>
            <Link href="/compatibility" className={`no-underline text-inherit ${pathName === '/compatibility' ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Compatibility</Button>
            </Link>
            <Link href="/wardrobe" className={`no-underline text-inherit ${pathName === '/wardrobe' ? 'border-b-2 border-blue-500 rounded' : ''}`}>
                <Button className="p-button-text p-button-plain">Wardrobe</Button>
            </Link>
        </div>
    );

    const handleClick = () => {
        setImgSrc(prevSrc => prevSrc === "/france.png" ? "/usa.png" : "/france.png");
    };

    const handleAccountClick = () => {
        router.push('/account')
    }

    const handleLogoutClick = async () => {
        try {
            const res = await getEmployeesService.logout()
            Swal.fire({
                title: res,
                icon: 'success',
                timer: 5000,
                timerProgressBar: true,
                position: 'top-right',
                toast: true,
                showConfirmButton: false
              })
              router.push('/login')
        } catch (error: any) {
            if (error instanceof FetchError) {
                Swal.fire({
                    title: error.message,
                    text: error.details as string | undefined,
                    icon: 'error',
                    timer: 5000,
                    timerProgressBar: true,
                    position: 'top-right',
                    toast: true,
                    showConfirmButton: false
                })
                error.logError()
            }
        }
    }

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode)
        // implement css logic here if we have the will to do it
    }

    const getEmployeeImage = async () => {
        try {
            const myself = await getEmployeesService.getEmployeeMe()
            const encodedImage = await getEmployeesService.getEmployeeImage({ id: myself.id })

            return `data:image/jpeg;base64,${encodedImage}`
        } catch (error) {
            if (error instanceof FetchError)
                error.logError()
            else
                console.error('Unexpected error:', error);
            return null
        }
    }

    const endContent = (
        <React.Fragment>
            <Button
                icon={isDarkMode ? "pi pi-moon" : "pi pi-sun"}
                className="rounded-full mr-5 bg-indigo-600 w-10 h-10 flex items-center justify-center"
                onClick={toggleDarkMode}
            />
            <Image
                className="w-9 h-9 cursor-pointer rounded-full mr-5 focus:outline-none focus:ring focus:ring-[#82CBEB]"
                src={imgSrc}
                alt="Language Flag"
                width={35}
                height={35}
                onClick={handleClick}
                tabIndex={0}
            />
            {employeeImage ? (
                <Image
                    className="cursor-pointer rounded-full mr-5 focus:outline-none focus:ring focus:ring-[#82CBEB]"
                    src={employeeImage}
                    alt="Employee Image"
                    width={37}
                    height={37}
                    style={{ borderRadius: '50%' }}
                    onClick={e => op.current?.toggle(e)}
                    tabIndex={0}
                />
            ) : (
                <Button icon="pi pi-user" className="rounded-full mr-5 bg-indigo-600 w-10 h-10 flex items-center justify-center" onClick={e => op.current?.toggle(e)} />
            )}
            <OverlayPanel ref={op} className="p-overlaypanel">
                <div className="flex flex-col">
                    <Button
                        label="Account"
                        icon="pi pi-user"
                        className="p-button-text mb-2 w-full justify-start"
                        onClick={handleAccountClick}
                    />
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-text mb-2 w-full justify-start"
                        onClick={handleLogoutClick}
                    />
                </div>
            </OverlayPanel>
        </React.Fragment>
    );

    return (
        <div className="card">
            <Toolbar start={startContent} center={centerContent} end={endContent} />
        </div>
    )
}