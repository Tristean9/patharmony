'use client';
import Header from '@/components/Header';
import {useAuth} from '@/hooks/useAuth';
import dynamic from 'next/dynamic';
const EditableTable = dynamic(() => import('./components/EditableTable'), {ssr: false});

export default function Admin() {
    useAuth('admin');
    return (
        <div>
            <Header title="违停情况中控处理页面" />
            <EditableTable />
        </div>
    );
}
