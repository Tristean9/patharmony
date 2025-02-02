import {UpdateParam} from '@/types';
import {create} from 'zustand';

interface AdminState {
    updateData: (report: UpdateParam) => Promise<void>;
    deleteData: (reportId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>(set => ({
    updateData: async (report: UpdateParam) => {},
    deleteData: async (reportId: string) => {},
}));
