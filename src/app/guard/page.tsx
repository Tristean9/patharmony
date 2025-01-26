'use client';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import {useState, createContext} from 'react';
import {useAuth} from '@/hooks/useAuth';
import {Position} from '@/types';
const EditableTable = dynamic(() => import('./components/EditableTable'), {ssr: false});
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export interface PositionsContextType {
    selectedPositions: Position[];
    updateSelectedPositions: (newPosition: Position[]) => void;
}

export const PositionsContext = createContext<PositionsContextType>({
    selectedPositions: [],
    updateSelectedPositions: () => {},
});

export default function Guard() {
    useAuth('guard');
    const [selectedPositions, setSelectedPositions] = useState<Position[]>([]);

    return (
        <PositionsContext.Provider value={{selectedPositions, updateSelectedPositions: setSelectedPositions}}>
            <div>
                <Header title="违停情况保安员确认页面" />
                <div className="px-6">
                    <EditableTable />
                    <div>
                        被选中的记录将会自动显示在地图上
                    </div>
                    <MapContainer />
                </div>
            </div>
        </PositionsContext.Provider>
    );
}
