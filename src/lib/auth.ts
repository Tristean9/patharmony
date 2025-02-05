import {Role} from '@/types';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

// 用于验证第三方令牌
export async function verifyThirdPartyToken(token: string) {
    // 根据 token (即 patharmonyRole) 生成用户信息
    const role = token;
    return role;
}

export function unauthorizedResponse() {
    return NextResponse.json(
        {success: false, error: '未授权的请求。'},
        {status: 401}
    );
}
