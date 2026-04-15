import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { authAdmin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idToken } = body;

        if (!idToken) {
            return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
        }

        // Verify the Firebase idToken
        let decodedToken;
        try {
            decodedToken = await authAdmin.verifyIdToken(idToken);
        } catch (error) {
            console.error('Firebase token verification failed:', error);
            return NextResponse.json({ error: 'Invalid or expired idToken' }, { status: 401 });
        }

        const uid = decodedToken.uid;
        const email = decodedToken.email;

        // Custom JWT is now safely generated for our own secure session
        const token = signJWT({ uid, email });

        const response = NextResponse.json({ 
            success: true, 
            message: 'Authenticated successfully',
            user: { uid, email }
        });

        // Set JWT as an HTTP-only cookie
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Use 'lax' for general use, 'strict' if highly specific
            path: '/',
            maxAge: 3600 // 1 hour in seconds
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
