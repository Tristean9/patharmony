import {unauthorizedResponse} from '@/lib/auth';
import {Role} from '@/types';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const token = await getToken({req});

    if (token?.role !== Role.Admin && token?.role !== Role.Guard && token?.role !== Role.User) {
        return unauthorizedResponse();
    }

    return NextResponse.json({
        apikey: process.env.AMAP_API_KEY,
        error: null,
    });
}
