import {fetchMapAPIKey} from '@/api/map';
import {fetchTodayReports, UpdateReport, updateReport} from '@/api/reports';
import {Position} from '@/types';
import {create} from 'zustand';

interface GuardState {
    apikeyPromise: ReturnType<typeof fetchMapAPIKey>;
    selectedPositions: Position[];
    dataPromise: ReturnType<typeof fetchTodayReports>;
    updateSelectedPositions: (newPosition: Position[]) => void;
    updateData: (report: UpdateReport) => Promise<void>;
}

export const useGuardStore = create<GuardState>(set => ({
    apikeyPromise: fetchMapAPIKey(),
    selectedPositions: [],
    dataPromise: fetchTodayReports(),
    updateSelectedPositions: (newPosition: Position[]) => {
        set({selectedPositions: newPosition});
    },
    updateData: async (report: UpdateReport) => {
        await updateReport(report);
        set({dataPromise: fetchTodayReports()});
    },
}));
