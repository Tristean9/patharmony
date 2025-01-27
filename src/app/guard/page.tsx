'use client';
import Header from '@/components/Header';
import {GuardContext} from '@/contexts';
import {useAuth, useReports} from '@/hooks';
import {Position} from '@/types';
import {getNow} from '@/utils';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import {columns, DataTable} from './components/table';
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function Guard() {
    useAuth('guard');
    const now = getNow();
    const {reportData, error, loading, updateData} = useReports({
        dateFrom: now.startOf('day').format(),
        dateEnd: now.endOf('day').format(),
        processed: false,
    });
    const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);

    return (
        <GuardContext.Provider value={{selectedPositions, updateSelectedPositions: setSelectedPositions, updateData}}>
            <div>
                <Header title="违停情况保安员确认页面" />
                <div className="px-6">
                    <div className="container mx-auto py-10">
                        {loading && <div>loading...</div>}
                        {error
                            ? <div>{error}</div>
                            : <DataTable columns={columns} data={reportData} />}
                    </div>
                    <div>
                        被选中的记录将会自动显示在地图上
                    </div>
                    <MapContainer />
                </div>
            </div>
        </GuardContext.Provider>
    );
}
