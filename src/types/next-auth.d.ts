import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            jwt: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        role: string;
        jwt: string;
    }
}
