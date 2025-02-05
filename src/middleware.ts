import {getToken} from 'next-auth/jwt';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {Role} from './types';

const roleAccess: Record<Role, Role[]> = {
    user: [Role.User, Role.Guard, Role.Admin],
    guard: [Role.Guard, Role.Admin],
    admin: [Role.Admin],
};

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // 页面所需权限和已有权限
    const needRole = pathname.split('/')[1] as Role;
    const token = await getToken({req});
    const role = token?.role as Role;

    if (!role || !roleAccess[needRole]?.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/signin';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/user/:path*', '/guard/:path*', '/admin/:path*'],
};
