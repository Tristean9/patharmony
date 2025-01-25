'use client';
import Header from '@/components/Header';
import {Button} from 'antd';
import dynamic from 'next/dynamic';
import {useState} from 'react';
import {useAuth} from '@/hooks/useAuth';
import {Position} from '@/types';
const EditableTable = dynamic(() => import('./components/EditableTable'), {ssr: false});
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function Guard() {
    useAuth('guard');
    // 用于收到表格组件传递的数据
    const [selectedPosition, setSelectedPosition] = useState<Position[]>([]);
    // 用于给地图组件传递数据
    const [positionsData, setPositionsData] = useState<Position[]>([]);

    const handleLocationAddMarker = () => {
        setPositionsData(selectedPosition);
    };

    return (
        <div>
            <Header title="违停情况保安员确认页面" />
            <div className="px-6">
                <EditableTable handleSelectedPosition={setSelectedPosition} />
                <Button
                    type="primary"
                    className="bg-customRed"
                    onClick={handleLocationAddMarker}
                >
                    将选中的记录显示在地图上
                </Button>
                <MapContainer positionsData={positionsData} />
            </div>
        </div>
    );
}
