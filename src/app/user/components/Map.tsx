'use client';
import '@amap/amap-jsapi-types';
import ErrorAlert from '@/components/ErrorAlert';
import {useUserStore} from '@/stores';
import {Position} from '@/types';
import AMapLoader from '@amap/amap-jsapi-loader';
import {use, useRef} from 'react';

export default function Map() {
    const {apikeyPromise, currentPositionPromise, updateCurrentPosition} = useUserStore();
    const {apikey, error: keyError} = use(apikeyPromise);
    const {position, error: positionError} = use(currentPositionPromise);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<AMap.Map | null>(null);

    if (keyError || !apikey) {
        return <ErrorAlert message={keyError} />;
    }

    if (positionError) {
        return <ErrorAlert message={positionError} />;
    }

    if (!mapInstanceRef.current && position) {
        AMapLoader
            .load({
                key: apikey,
                version: '2.0',
            })
            .then(AMap => {
                const map = new AMap.Map(mapContainerRef.current, {
                    viewMode: '2D',
                    zoom: 15,
                    center: position,
                });

                const marker = new AMap.Marker({
                    position: position,
                    title: '当前位置',
                    draggable: true,
                });

                updateCurrentPosition(position);

                marker.on('dragend', () => {
                    const markerPos = marker.getPosition() as AMap.LngLat;
                    const newPosition: Position = [
                        markerPos.getLng(),
                        markerPos.getLat(),
                    ];
                    updateCurrentPosition(newPosition);
                });

                map.add(marker);
                mapInstanceRef.current = map;
            })
            .catch(error => {
                console.error('地图加载失败', error);
            });
    }

    return <div ref={mapContainerRef} className="z-10 min-h-[200px] h-[30vh]" />;
}
