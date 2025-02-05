'use client';
import '@amap/amap-jsapi-types';
import ErrorAlert from '@/components/ErrorAlert';
import {useGuardStore} from '@/stores';
import AMapLoader from '@amap/amap-jsapi-loader';
import {use, useRef} from 'react';

export default function Map() {
    const {apikeyPromise, selectedPositions} = useGuardStore();
    const {apikey, error} = use(apikeyPromise);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<AMap.Map | null>(null);
    const markersRef = useRef<AMap.Marker[]>([]);

    if (error || !apikey) {
        return <ErrorAlert message={error} />;
    }

    if (!mapInstanceRef.current) {
        AMapLoader
            .load({
                key: apikey,
                version: '2.0',
            })
            .then(AMap => {
                const map = new AMap.Map(mapContainerRef.current, {
                    viewMode: '2D',
                    zoom: 15,
                    center: [116.308303, 39.988792],
                });

                mapInstanceRef.current = map;
            })
            .catch(error => {
                console.error('地图加载失败', error);
            });
    }
    else {
        mapInstanceRef.current.setCenter(selectedPositions[0] ?? [116.308303, 39.988792]);

        const newSet = new Set(selectedPositions.map(pos => pos.toString()));

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
        selectedPositions.forEach(position => {
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
                (mapInstanceRef.current as AMap.Map).add(marker);
                markersRef.current.push(marker);
            }
        });
    }

    return <div ref={mapContainerRef} className="z-10 min-h-[200px] h-[30vh]" />;
}
