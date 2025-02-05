'use client';
import {signOut} from 'next-auth/react';
import {useRouter} from 'next/navigation';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({redirect: false});
        router.push('/auth/signin');
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-transparent"
        >
            登出
        </button>
    );
};

export default LogoutButton;
