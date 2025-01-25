import {Role} from '@/types';
import {getSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

const roleAccess = {
    user: ['user', 'guard', 'admin'],
    guard: ['guard', 'admin'],
    admin: ['admin'],
};

export const useAuth = (requiredRole: Role) => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            const role = session?.user?.role;

            if (!role || !roleAccess[requiredRole].includes(role)) {
                router.push('/login');
            }
        };
        checkAuth();
    }, [router, requiredRole]);
};
