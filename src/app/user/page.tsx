'use client';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import {useState, createContext} from 'react';
import InfoForm from './components/InfoForm';
import Notice from './components/Notice';
import {useAuth} from '@/hooks/useAuth';
import {Position} from '@/types';
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export interface PositionContextType {
    currentPosition: Position;
    updateCurrentPosition: (newPosition: Position) => void;
}

export const PositionContext = createContext<PositionContextType>({
    currentPosition: [116.308303, 39.988792],
    updateCurrentPosition: () => {},
});

export default function Student() {
    useAuth('user');
    const [currentPosition, setCurrentPosition] = useState<Position>([116.308303, 39.988792]);

    return (
        <PositionContext.Provider value={{currentPosition, updateCurrentPosition: setCurrentPosition}}>
            <div>
                <Header title="违停情况学生反馈提交页面" />
                <MapContainer />
                <InfoForm />
                <Notice />
            </div>
        </PositionContext.Provider>
    );
}
