import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (!token.role) {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    return NextResponse.json({
        apikey: process.env.AMAP_API_KEY,
        error: null,
    });
}
