import {Position, UpdateParam} from '@/types';
import {create} from 'zustand';

interface GuardState {
    selectedPositions: Position[];
    updateSelectedPositions: (newPosition: Position[]) => void;
    updateData: (report: UpdateParam) => Promise<void>;
}

export const useGuardStore = create<GuardState>((set, get) => ({
    selectedPositions: [],
    updateSelectedPositions: (newPosition: Position[]) => {
        set(state => ({selectedPositions: newPosition}));
    },
    updateData: async (report: UpdateParam) => {},
}));
