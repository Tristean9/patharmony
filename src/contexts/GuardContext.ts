import {Position, UpdateReport} from '@/types';
import {createContext} from 'react';

export interface GuardContextType {
    selectedPositions: Position[];
    updateSelectedPositions: (newPosition: Position[]) => void;
    updateData: (report: UpdateReport) => Promise<void>;
}

export const GuardContext = createContext<GuardContextType>({
    selectedPositions: [],
    updateSelectedPositions: () => {},
    updateData: async () => {},
});
