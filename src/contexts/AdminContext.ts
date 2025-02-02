import {UpdateReport} from '@/types';
import {createContext} from 'react';

export interface AdminContextType {
    updateData: (report: UpdateReport) => Promise<void>;
    deleteData: (reportId: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType>({
    updateData: async () => {},
    deleteData: async () => {},
});
