'use client'
import React, { useEffect, useState } from "react";
import './homepage.css';
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation";

import EmployeesService from '@/app/services/employees'

const employeesService = new EmployeesService()

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await employeesService.isConnected()
      if (isConnected)
        router.push('/dashboard')
    }
    checkConnection()
  }, [router])

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
      router.push('/dashboard')
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

  const isFormValid = email !== '' && password !== '';

  return (
    <div className="bg-color">
      <div className="container">
        <img className="image" src="women_catch.png" />
        <div className="title"> Soul Connection </div>
        <img className="image" src="men_catch.png" />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="title-signup"> Sign in to your account </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="box">
            <Email value={email} onChange={setEmail} />
            <Password value={password} onChange={setPassword} />
            <ButtonSign onClick={handleLogIn} disabled={!isFormValid} />
            <CreateAccount />
          </form>
        </div>
      </div>
    </div>
  );
}

const Email: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="email" className="email-text"> Email address </label>
      <div>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

const Password: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="password" className="password-text"> Password </label>
      <div className="mt-2">
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" value={value} onChange={e => onChange(e.target.value)} />
      </div>
    </div>
  )
}

const ButtonSign: React.FC<{ onClick: () => void, disabled: boolean }> = ({ onClick, disabled }) => {
  return (
    <>
      <button type="button" className="button-signin" onClick={onClick} disabled={disabled}>
        <div className="button-signin-text"> Log in </div>
      </button>
    </>
  );
}

function CreateAccount() {
  return (
    <div className="create-account">
      <div className="create-account-text"> Don&apos;t have an account?&thinsp;</div>
      <a href="create-account">
        <div className="create-account-text"> Create an account </div>
      </a>
    </div>
  );
}
