import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import AMapLoader from '@amap/amap-jsapi-loader';
import { getCurrentLocation } from '@/utils';

export const useMap = (containerId: string) => {
    const map = useRef<AMap.Map | null>(null);
    const [mapAPIKey, setMapAPIKey] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [mapLoaded, setMapLoaded] = useState<boolean>(false);

    const loadMap = useCallback(async () => {
        if (!mapAPIKey || typeof window === 'undefined' || !containerId) {
            return;
        }

        const { position, error } = await getCurrentLocation();
        if (error) {
            setError('请打开定位服务，并刷新页面');
            setLoading(false);
            return;
        }
        const initPosition = [
            position?.longitude ?? 116.308303,
            position?.latitude ?? 39.988792,
        ];

        try {
            const AMap = await AMapLoader.load({
                key: mapAPIKey,
                version: '2.0',
                plugins: [],
            });

            const initializedMap: AMap.Map = new AMap.Map(containerId, {
                viewMode: '2D',
                zoom: 15,
                center: initPosition,
            });

            map.current = initializedMap;
            setMapLoaded(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred 地图加载失败');
            }
        } finally {
            setLoading(false);
        }
    }, [mapAPIKey, containerId]);

    // 获取地图API Key
    useEffect(() => {
        const fetchMapAPIKey = async () => {
            try {
                const response = await axios.get('/api/session/locationMap');
                const { apikey } = response.data;
                setMapAPIKey(apikey);
            } catch (err) {
                let errorMessage = 'An unknown error occurred';
                if (axios.isAxiosError(err)) {
                    // 处理 Axios 错误
                    if (err.response) {
                        errorMessage = `Server error: ${
                            err.response.status
                        } - ${JSON.stringify(err.response.data)}`;
                    } else if (err.request) {
                        errorMessage = 'No response received from server';
                    } else {
                        errorMessage = err.message;
                    }
                } else if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchMapAPIKey();
    }, []);

    useEffect(() => {
        if (mapAPIKey) {
            loadMap();
        }
    }, [mapAPIKey, loadMap]);

    return { map, loading, error, mapLoaded };
};
