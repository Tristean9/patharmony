import {deleteData, fetchAllReports, UpdateReport, updateReport} from '@/api/reports';
import {create} from 'zustand';

interface AdminState {
    dataPromise: ReturnType<typeof fetchAllReports>;
    updateData: (report: UpdateReport) => Promise<void>;
    deleteData: (reportId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>(set => ({
    dataPromise: fetchAllReports(),
    updateData: async (report: UpdateReport) => {
        await updateReport(report);
        set({dataPromise: fetchAllReports()});
    },
    deleteData: async reportId => {
        await deleteData(reportId);
        set({dataPromise: fetchAllReports()});
    },
}));
