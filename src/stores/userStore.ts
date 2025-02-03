import {fetchMapAPIKey} from '@/api/map';
import {Position} from '@/types';
import {getCurrentPosition} from '@/utils';
import {create} from 'zustand';

export interface UserState {
    position: Position;
    apikeyPromise: ReturnType<typeof fetchMapAPIKey>;
    currentPositionPromise: ReturnType<typeof getCurrentPosition>;
    updateCurrentPosition: (newPosition: Position) => void;
}

export const useUserStore = create<UserState>(set => ({
    position: [116.308303, 39.988792],
    apikeyPromise: fetchMapAPIKey(),
    currentPositionPromise: getCurrentPosition(),
    updateCurrentPosition: (newPosition: Position) => {
        set({
            position: newPosition,
        });
    },
}));
