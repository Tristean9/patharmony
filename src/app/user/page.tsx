import ClientOnly from '@/components/ClientOnly';
import Header from '@/components/Header';
import {Suspense} from 'react';
import InfoForm from './components/InfoForm';
import Map from './components/Map';
import Notice from './components/Notice';

export default function User() {
    return (
        <>
            <Header title="违停情况学生反馈提交页面" />
            <Suspense fallback={<div>Loading...</div>}>
                <ClientOnly>
                    <Map />
                </ClientOnly>
            </Suspense>
            <InfoForm />
            <Notice />
        </>
    );
}
