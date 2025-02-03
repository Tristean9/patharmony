'use client';
import '@amap/amap-jsapi-types';
import {fetchMapAPIKey} from '@/api/map';
import ErrorAlert from '@/components/ErrorAlert';
import {useUserStore} from '@/stores';
import {Position} from '@/types';
import {getCurrentPosition} from '@/utils';
import AMapLoader from '@amap/amap-jsapi-loader';
import {use, useEffect, useRef} from 'react';

interface MapProps {
    mapPromise: ReturnType<typeof fetchMapAPIKey>;
    positionPromise: ReturnType<typeof getCurrentPosition>;
}

export default function Map({mapPromise, positionPromise}: MapProps) {
    const {apikey, error: keyError} = use(mapPromise);
    const {position, error: positionError} = use(positionPromise);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<AMap.Map | null>(null);

    const {updateCurrentPosition} = useUserStore();

    if (keyError) {
        return <ErrorAlert message={keyError} />;
    }
    if (positionError) {
        return <ErrorAlert message={positionError} />;
    }

    useEffect(() => {
        if (apikey && position && mapContainerRef.current && !mapInstanceRef.current) {
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

                    const center = map.getCenter();
                    const marker = new AMap.Marker({
                        position: center,
                        title: '当前位置',
                        draggable: true,
                    });

                    const initialPosition: Position = [
                        center.getLng() ?? 116.308303,
                        center.getLat() ?? 39.988792,
                    ];
                    updateCurrentPosition(initialPosition);

                    map.add(marker);

                    marker.on('dragend', () => {
                        const markerPos = marker.getPosition() as AMap.LngLat;
                        const newPosition: Position = [
                            markerPos.getLng() ?? 116.308303,
                            markerPos.getLat() ?? 39.988792,
                        ];
                        updateCurrentPosition(newPosition);
                    });

                    mapInstanceRef.current = map;
                })
                .catch(error => {
                    console.error('地图加载失败', error);
                });
        }
    }, []);

    return <div ref={mapContainerRef} className="z-10 min-h-[200px] h-[30vh]" />;
}
