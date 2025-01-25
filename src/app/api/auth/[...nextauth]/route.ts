import {verifyThirdPartyToken} from '@/lib';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {verify} from 'jsonwebtoken';
import {DecodedToken} from '@/types';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                token: {label: 'Token', type: 'text'},
            },
            authorize: async credentials => {
                const token = credentials?.token;

                if (!token) {
                    return null;
                }

                // 如果 token 是 JWT，则验证 JWT
                try {
                    const decoded = verify(token as string, process.env.JWT_SECRET as string) as DecodedToken;
                    return {
                        id: decoded.id,
                        role: decoded.role,
                        jwt: token,
                    };
                }
                catch (error) {
                    // 如果 token 不是 JWT，则根据 role 生成 JWT
                    const user = await verifyThirdPartyToken(token);
                    if (user) {
                        return user;
                    }
                    else {
                        return null;
                    }
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        maxAge: 7 * 24 * 60 * 60, // JWT 有效期为一周（7 天）
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // 假设用户对象中有角色信息
                token.jwt = user.jwt; // 将 JWT 添加到 token 中
            }
            return token;
        },
        async session({session, token}) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.jwt = token.jwt; // 将 JWT 添加到 session 中

            return session;
        },
    },
});

export {handler as GET, handler as POST};
