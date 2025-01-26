'use client';
import {useCallback, useContext, useEffect, useState} from 'react';
import '@amap/amap-jsapi-types';
import {useMap} from '@/hooks/';
import {Position} from '@/types';
import {Alert} from 'antd';
import {PositionContext} from '../page';

export default function MapContainer() {
    const {map, loading, error, mapLoaded} = useMap('map-container');
    const [mapError, setMapError] = useState<string | null>(null);
    const {updateCurrentPosition} = useContext(PositionContext);

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
            const initialPosition = [
                center.getLng() ?? 116.308303,
                center.getLat() ?? 39.988792,
            ] as Position;
            updateCurrentPosition(initialPosition);

            (map.current as AMap.Map).add(marker);
            // 给 marker 添加事件监听，拖拽后更新位置
            marker.on('dragend', () => {
                const markerPos = marker.getPosition() as AMap.LngLat;
                const newPosition = [
                    markerPos.getLng() ?? 116.308303,
                    markerPos.getLat() ?? 39.988792,
                ] as Position;
                updateCurrentPosition(newPosition);
            });
        }
        catch (error) {
            setMapError(`打开定位服务，并刷新页面。${error}`);
        }
    }, [updateCurrentPosition, map, mapLoaded]);

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
}
