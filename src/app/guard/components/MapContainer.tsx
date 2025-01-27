'use client';
import {useCallback, useContext, useEffect, useRef} from 'react';
import '@amap/amap-jsapi-types';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {GuardContext} from '@/contexts';
import {useMap} from '@/hooks';
import {Position} from '@/types';
import {AlertCircle} from 'lucide-react';

export default function MapContainer() {
    const {selectedPositions} = useContext(GuardContext);
    const markersRef = useRef<AMap.Marker[]>([]);
    const {map, loading, error, mapLoaded} = useMap('map-container');

    // 将被选中的位置更新到地图上
    const updateMarkers = useCallback((positions: Position[]) => {
        if (typeof window === 'undefined' || !mapLoaded) {
            return;
        }
        const newSet = new Set(positions.map(pos => pos.toString()));

        // 移除不在新数据中的标记
        markersRef.current = markersRef.current.filter(marker => {
            const markerPos = marker.getPosition() as AMap.LngLat;
            const key = [markerPos.getLng(), markerPos.getLat()].toString();
            if (!newSet.has(key)) {
                marker.remove();
                return false;
            }
            return true;
        });

        // 添加新的标记
        positions.forEach(position => {
            const key = position.toString();
            const exists = markersRef.current.some(marker => {
                const markerPos = marker.getPosition() as AMap.LngLat;
                return key === [markerPos.getLng(), markerPos.getLat()].toString();
            });
            if (!exists) {
                const marker = new AMap.Marker({
                    position: position,
                    title: '当前位置',
                });
                (map.current as AMap.Map).add(marker);
                markersRef.current.push(marker);
            }
        });
    }, [map, mapLoaded]);

    useEffect(() => {
        updateMarkers(selectedPositions);
    }, [selectedPositions, updateMarkers]);

    if (loading) {
        return <div>loading...</div>;
    }
    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
        );
    }
    return (
        <div>
            <div
                id="map-container"
                className="mt-6 z-10 min-h-[500px] h-[30vh]"
            >
            </div>
        </div>
    );
}
