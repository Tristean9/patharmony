'use client';
import Header from '@/components/Header';
import {useAuth, useReports} from '@/hooks';
import {UpdateParam} from '@/types';
import {getNow} from '@/utils';
import {createContext} from 'react';
import {columns, DataTable} from './components/table';
export interface AdminContextType {
    updateData: (report: UpdateParam) => Promise<void>;
    deleteData: (reportId: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType>({
    updateData: async () => {},
    deleteData: async () => {},
});

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
