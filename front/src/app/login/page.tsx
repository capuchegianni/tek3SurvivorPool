'use client'
import React, { useState } from "react";
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation";

import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import EmployeesService from '@/app/services/employees'
import Image from "next/image";

const employeesService = new EmployeesService()

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogIn = async () => {
    try {
      const res = await employeesService.login({ email, password });

      Swal.fire({
        title: res,
        icon: 'success',
        timer: 5000,
        timerProgressBar: true,
        position: 'top-right',
        toast: true,
        showConfirmButton: false
      })
      router.push('/intra/dashboard')
    } catch (error: any) {
      Swal.fire({
        title: error.message,
        text: error.details,
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
        position: 'top-right',
        toast: true,
        showConfirmButton: false
      })
    }
    setEmail('')
    setPassword('')
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setEmail(email)
    setIsEmailValid(validateEmail(email))
  }

  const isFormValid = email !== '' && password !== '' && isEmailValid;

  return (
    <div className="m-4 justify-center">
      <div className="flex justify-between items-center md:flex-row flex-col">
        <Image className="w-1/4 hidden md:block" alt='women_catch' src={'/women_catch_no_bg.png'} width={500} height={200} />
        <div className="flex flex-col items-center w-full md:w-auto">
          <p className="text-5xl font-bold flex justify-center text-[#2A27D2] pt-5">Soul Connection</p>
          <div className="w-full h-1 bg-[#2A27D2] mt-2"></div>
        </div>
        <Image className="w-1/4 hidden md:block" alt='men_catch' src={'/men_catch_no_bg.png'} width={500} height={200} />
      </div>
      <div className="flex flex-1 flex-col lg:px-8">
        <div className="mt-10 mx-auto w-full md:max-w-md bg-gray-300 rounded-lg text-center p-8">
          <p className="text-3xl font-bold text-center mb-12">Log in to your account</p>
          <div className="mt-1 mb-4">
            <label htmlFor="email" className="text-left block font-medium">Email address</label>
            <InputText id="email" type="email" value={email} onChange={handleEmailChange} className="w-full" />
          </div>
          <div className="mt-1 mb-4">
            <label htmlFor="password" className="text-left block font-medium">Password</label>
            <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} inputClassName="w-full" style={{ width: '100%' }} />
          </div>
          <div className="mb-4">
            <Button label="Log in" onClick={handleLogIn} disabled={!isFormValid} className="rounded-full w-full h-12 text-lg mt-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
