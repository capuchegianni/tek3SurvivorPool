import { NextResponse, NextRequest } from 'next/server';
import EmployeesService from './app/services/employees/get-employees';
import { cookies } from 'next/headers';

const employeesService = new EmployeesService();

export default async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl

    if (pathname === '/')
        return NextResponse.redirect(new URL('/login', origin))
    if (pathname.startsWith('/_next/') || pathname.match(/\.(jpg|jpeg|png|gif|svg)$/))
        return NextResponse.next()

    const cookieStore = cookies()
    const token = cookieStore.get('access_token_cookie')
    if (!token) {
        if (pathname === '/login')
            return NextResponse.next()
        return NextResponse.redirect(new URL('/login', origin))
    }

    try {
        const isConnected = await employeesService.isConnected({ token: token.value });

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