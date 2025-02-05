'use client';
import {Role} from '@/types';
import {getSession, signIn} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Suspense, useEffect} from 'react';

function SignIn() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            const role = session?.user?.role;
            if (role && Object.values(Role).includes(role)) {
                router.push(`/${role}`);
            }

            const patharmonyRole = searchParams.get('patharmonyRole');

            if (patharmonyRole) {
                // 如果有 patharmonyRole，根据角色验证第三方令牌，进行鉴权
                const result = await signIn('credentials', {
                    redirect: false,
                    token: patharmonyRole, // 使用 token 进行鉴权
                });

                if (result?.ok) {
                    // 登录成功，JWT 会自动存储在客户端浏览器中
                    const session = await getSession();
                    const role = session?.user?.role;

                    router.push(`/${role}`);
                }
                else {
                    console.error('鉴权失败');
                }
            }
        };
        checkAuth();
    }, [router]);

    const handleUserLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_BASE_URL}/?ref=${
            encodeURIComponent(window.location.href)
        }`;
    };

    const handleGuardLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_BASE_URL}/?ref=${
            encodeURIComponent(window.location.href)
        }`;
    };

    const handleAdminLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_THIRD_PARTY_API_BASE_URL}/?ref=${
            encodeURIComponent(window.location.href)
        }`;
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

export default function SingnInPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignIn />
        </Suspense>
    );
}
