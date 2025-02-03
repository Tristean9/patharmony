'use client';
import Header from '@/components/Header';
import {useAuth} from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';
const Map = dynamic(() => import('./components/Map'), {ssr: false});

export default function User() {
    useAuth('user');
    return (
        <>
            <Header title="违停情况学生反馈提交页面" />
            <Suspense fallback={<div>Loading...</div>}>
                <Map  />
            </Suspense>
            <InfoForm />
            <Notice />
        </>
    );
}
