import {UpdateParam} from '@/types';
import {createContext} from 'react';

export interface AdminContextType {
    updateData: (report: UpdateParam) => Promise<void>;
    deleteData: (reportId: string) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType>({
    updateData: async () => {},
    deleteData: async () => {},
});
