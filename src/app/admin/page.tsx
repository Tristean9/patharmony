'use client';
import Header from '@/components/Header';
import {Suspense} from 'react';
import {useAuth} from '@/hooks';
import {columns, DataTable} from './components/table';

export default function Admin() {
    useAuth('admin');

    return (
        <>
            <Header title="违停情况中控处理页面" />
            <Suspense fallback={<div>Loading...</div>}>
                <div className="container mx-auto py-10">
                    <DataTable columns={columns} />
                </div>
            </Suspense>
        </>
    );
}
