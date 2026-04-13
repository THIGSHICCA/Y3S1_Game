import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function GET() {
    // Await the cookies() function call to get the ReadonlyRequestCookies object
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = verifyJWT(token);

    if (!payload) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Token is valid, return protected data
    return NextResponse.json({
        success: true,
        message: 'You have accessed a protected route!',
        user: payload
    });
}
