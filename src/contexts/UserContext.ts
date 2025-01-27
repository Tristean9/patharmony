import {Position} from '@/types';
import {createContext} from 'react';

export interface UserContextType {
    currentPosition: Position;
    updateCurrentPosition: (newPosition: Position) => void;
}

export const UserContext = createContext<UserContextType>({
    currentPosition: [116.308303, 39.988792],
    updateCurrentPosition: () => {},
});
