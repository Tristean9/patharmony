import {verifyThirdPartyToken} from '@/lib';
import {Role} from '@/types';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                token: {label: 'Token', type: 'text'},
            },
            authorize: async credentials => {
                const token = credentials?.token;
                console.log('token', token);

                if (!token) {
                    return null;
                }

                const role = await verifyThirdPartyToken(token);
                if (role && ['user', 'guard', 'admin'].includes(role)) {
                    return {id: 'user-id', role: role as Role};
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 7 * 24 * 60 * 60, // JWT 有效期为一周（7 天）
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if (user?.role) {
                token.id = user.id;
                token.role = user.role; // 假设用户对象中有角色信息
            }
            return token;
        },
        async session({session, token}) {
            // 类型断言，告诉 TypeScript token 的类型
            const tokenWithRole = token as {id: string, role: Role};

            session.user.id = tokenWithRole.id;
            session.user.role = tokenWithRole.role;
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
    },
});

export {handler as GET, handler as POST};
