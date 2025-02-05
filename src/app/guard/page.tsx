import ClientOnly from '@/components/ClientOnly';
import Header from '@/components/Header';
import {Suspense} from 'react';
import Map from './components/Map';
import {columns, DataTable} from './components/table';

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
                    <ClientOnly>
                        <Map />
                    </ClientOnly>
                </Suspense>
            </div>
        </>
    );
}
