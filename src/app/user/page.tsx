'use client';
import {fetchMapAPIKey} from '@/api/map';
import Header from '@/components/Header';
import {useAuth} from '@/hooks/useAuth';
import {getCurrentPosition} from '@/utils';
import {Suspense} from 'react';
import InfoForm from './components/InfoForm';
import Map from './components/Map';
import Notice from './components/Notice';

export default function User() {
    useAuth('user');
    const mapPromise = fetchMapAPIKey();
    const positionPromise = getCurrentPosition();

    return (
        <>
            <Header title="违停情况学生反馈提交页面" />
            <Suspense fallback={<div>Loading...</div>}>
                <Map mapPromise={mapPromise} positionPromise={positionPromise} />
            </Suspense>
            <InfoForm />
            <Notice />
        </>
    );
}
