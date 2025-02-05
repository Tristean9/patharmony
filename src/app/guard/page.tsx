'use client';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import {Suspense} from 'react';
import {columns, DataTable} from './components/table';
const Map = dynamic(() => import('./components/Map'), {ssr: false});

export default function Guard() {
    return (
        <>
            <Header title="违停情况保安员确认页面" />
            <div className="px-6">
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="container mx-auto py-10">
                        <DataTable columns={columns} />
                    </div>
                </Suspense>
                <div>被选中的记录将会自动显示在地图上</div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Map />
                </Suspense>
            </div>
        </>
    );
}
