'use client';
import {useCallback, useEffect, useState} from 'react';
import '@amap/amap-jsapi-types';
import {useMap} from '@/hooks/';
import {MyPosition} from '@/types';
import {Alert} from 'antd';

interface MapContainerProps {
    setCurrentPosition: (position: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({setCurrentPosition}) => {
    const [, setPosition] = useState<MyPosition | null>(null);
    const {map, loading, error, mapLoaded} = useMap('map-container');
    const [mapError, setMapError] = useState<string | null>(null);

    const updatePosition = useCallback((newPosition: MyPosition) => {
        setPosition(newPosition);
        setCurrentPosition(`${newPosition.latitude}°,${newPosition.longitude}°`);
    }, [setCurrentPosition, setPosition]);

    const updateMarker = useCallback(async () => {
        if (typeof window === 'undefined' || !mapLoaded) {
            return;
        }

        try {
            const center = (map.current as AMap.Map).getCenter();
            const marker: AMap.Marker = new AMap.Marker({
                position: center,
                title: '当前位置',
                draggable: true,
            });

            updatePosition({latitude: center.getLat(), longitude: center.getLng()});

            (map.current as AMap.Map).add(marker);
            // 给 marker 添加事件监听，拖拽后更新位置
            marker.on('dragend', () => {
                const markerPos = marker.getPosition() as AMap.LngLat;
                const newPosition = {
                    latitude: markerPos.getLat(),
                    longitude: markerPos.getLng(),
                };
                updatePosition(newPosition);
            });
        } catch (error) {
            setMapError(`打开定位服务，并刷新页面。${error}`);
        }
    }, [updatePosition, map, mapLoaded]);

    useEffect(() => {
        updateMarker();
    }, [updateMarker]);

    if (loading) {
        return <div>Loading map...</div>;
    }
    if (mapError) {
        return <Alert message={mapError} type="error" closable />;
    }

    if (error) {
        return <Alert message={error} type="warning" closable />;
    }
    return (
        <div>
            <div className="font-medium">请拖拽地图或移动标记，确定提交的违停精确位置</div>
            <div
                id="map-container"
                className={'map-container'}
                style={{height: '350px'}}
            >
            </div>
        </div>
    );
};

export default MapContainer;
