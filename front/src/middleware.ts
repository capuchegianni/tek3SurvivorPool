import { NextResponse, NextRequest } from 'next/server';
import EmployeesService from './app/services/employees';
import { parse } from 'cookie'

const employeesService = new EmployeesService();

export default async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl

    if (pathname === '/')
        return NextResponse.redirect(new URL('/login', origin))
    if (pathname.startsWith('/_next/') || pathname.match(/\.(jpg|jpeg|png|gif|svg)$/))
        return NextResponse.next()

    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) {
        if (pathname === '/login')
            return NextResponse.next()
        return NextResponse.redirect(new URL('/login', origin))
    }
    const cookies = parse(cookieHeader)
    const token = cookies.access_token_cookie
    try {
        const isConnected = await employeesService.isConnected({ token });

        if (pathname === '/login') {
            if (isConnected.isConnected)
                return NextResponse.redirect(new URL('/dashboard', origin));
            return NextResponse.next()
        }
        if (!isConnected.isConnected)
            return NextResponse.redirect(new URL('/login', origin));
    } catch (error) {
        console.log(error)
    }


    return NextResponse.next();
}