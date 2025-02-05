import NextAuth, {DefaultSession} from 'next-auth';
import {Role} from './Role';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: Role;
        } & DefaultSession['user'];
    }

    interface JWT {
        role: Role;
    }
    interface User {
        id: string;
        role: Role;
    }
}
