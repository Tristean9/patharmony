'use client';
import Header from '@/components/Header';
import {Button} from 'antd';
import dynamic from 'next/dynamic';
import {useState} from 'react';
const EditableTable = dynamic(() => import('./components/EditableTable'), {ssr: false});
const MapContainer = dynamic(() => import('./components/MapContainer'), {ssr: false});

export default function Guard() {
    // 用于收到表格组件传递的数据
    const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
    // 用于给地图组件传递数据
    const [locationsData, setLocationsData] = useState<string[]>([]);

    // 给子组件调用的方法
    const handleSelectedLocation = (selectedLocation: string[]) => {
        setSelectedLocation(selectedLocation);
    };

    const handleLocationAddMarker = () => {
        setLocationsData(selectedLocation);
    };

    return (
        <div>
            <Header title="违停情况保安员确认页面" />
            <div className="px-6">
                <EditableTable handleSelectedLocation={handleSelectedLocation} />
                <Button
                    type="primary"
                    className="bg-customRed"
                    onClick={handleLocationAddMarker}
                >
                    将选中的记录显示在地图上
                </Button>
                <MapContainer locationsData={locationsData} />
            </div>
        </div>
    );
}
