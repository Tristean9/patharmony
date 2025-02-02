'use client';
import Header from '@/components/Header';
import {useAuth} from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function User() {
    useAuth('user');

    return (
        <>
            <Header title="违停情况学生反馈提交页面" />
            <MapContainer />
            <InfoForm />
            <Notice />
        </>
    );
}
