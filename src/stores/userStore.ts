import {Position} from '@/types';
import {create} from 'zustand';

export interface UserState {
    currentPosition: Position;
    updateCurrentPosition: (newPosition: Position) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    currentPosition: [116.308303, 39.988792],
    updateCurrentPosition: (newPosition: Position) => {
        set(state => ({currentPosition: newPosition}));
    },
}));
