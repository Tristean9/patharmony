'use client';
import {signIn, getSession} from 'next-auth/react';
import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            const role = searchParams.get('patharmonyRole');

            if (session) {
                // 如果有 JWT，直接进行鉴权
                handleAuthentication(session.user.jwt);
            }
            else if (role) {
                // 如果有 patharmonyRole，根据角色验证第三方令牌，进行鉴权
                handleAuthentication(role);
            }
        };
        checkAuth();
    }, [router]);

    const handleAuthentication = async (token: string) => {
        const result = await signIn('credentials', {
            redirect: false,
            token, // 使用 token 进行鉴权
        });

        if (result?.ok) {
            // 登录成功，JWT 会自动存储在客户端浏览器中
            const session = await getSession();
            const role = session?.user?.role;
            if (role === 'user') {
                router.push('/user');
            }
            else if (role === 'guard') {
                router.push('/guard');
            }
            else if (role === 'admin') {
                router.push('/admin');
            }
        }
        else {
            console.error('鉴权失败');
        }
    };

    const handleUserLogin = () => {
        window.location.href = `http://localhost:3001/?ref=${encodeURIComponent(window.location.href)}`;
    };

    const handleGuardLogin = () => {
        window.location.href = `http://localhost:3001/?ref=${encodeURIComponent(window.location.href)}`;
    };

    const handleAdminLogin = () => {
        window.location.href = `http://localhost:3001/?ref=${encodeURIComponent(window.location.href)}`;
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded shadow-md w-full max-w-sm flex flex-col gap-10">
                    <h1>登录页面</h1>
                    <button onClick={handleUserLogin}>反馈页面</button>
                    <button onClick={handleGuardLogin}>保安员页面</button>
                    <button onClick={handleAdminLogin}>管理员页面</button>
                </div>
            </div>
        </div>
    );
}
