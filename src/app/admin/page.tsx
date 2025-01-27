'use client';
import Header from '@/components/Header';
import {AdminContext} from '@/contexts';
import {useAuth, useReports} from '@/hooks';
import {getNow} from '@/utils';
import {columns, DataTable} from './components/table';

export default function Admin() {
    useAuth('admin');
    const now = getNow();
    const {reportData, error, loading, updateData, deleteData} = useReports({
        dateFrom: '2025-01-01T00:00:00+08:00',
        dateEnd: now.format(),
    });

    return (
        <AdminContext.Provider value={{updateData, deleteData}}>
            <div>
                <Header title="违停情况中控处理页面" />
                <div className="container mx-auto py-10">
                    {loading && <div>loading...</div>}
                    {error
                        ? <div>{error}</div>
                        : <DataTable columns={columns} data={reportData} />}
                </div>
            </div>
        </AdminContext.Provider>
    );
}
