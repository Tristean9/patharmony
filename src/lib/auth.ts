import {DecodedToken} from '@/types';
import {sign, verify} from 'jsonwebtoken';
import {NextRequest, NextResponse} from 'next/server';

export async function authenticate(req: NextRequest) {
    const token = req.cookies.get('jwt');

    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const decoded = verify(token as unknown as string, process.env.JWT_SECRET as string) as DecodedToken;
        return decoded;
    }
    catch (error) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

// 用于验证第三方令牌
export async function verifyThirdPartyToken(token: string) {
    // 根据 token (即 patharmonyRole) 生成用户信息
    const user = {
        id: 'user-id',
        role: token, // 使用 token 作为角色
    };

    // 根据用户信息生成 JWT
    const jwt = sign(user, process.env.JWT_SECRET as string, {expiresIn: '7d'});

    return {
        ...user,
        jwt,
    };
}

export function unauthorizedResponse() {
    return NextResponse.json({
        success: false,
        message: '未授权的请求。',
        error: '未授权',
    }, {status: 401});
}
