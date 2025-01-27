'use client';
import {getCurrentPosition} from '@/utils';
import AMapLoader from '@amap/amap-jsapi-loader';
import axios from 'axios';
import {useCallback, useEffect, useRef, useState} from 'react';

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

        const {position, error} = await getCurrentPosition();
        if (error) {
            setError(`打开定位服务，并刷新页面。${error}`);
            setLoading(false);
            return;
        }

        try {
            const AMap = await AMapLoader.load({
                key: mapAPIKey,
                version: '2.0',
                plugins: [],
            });

            const initializedMap: AMap.Map = new AMap.Map(containerId, {
                viewMode: '2D',
                zoom: 15,
                center: position,
            });

            map.current = initializedMap;
            setMapLoaded(true);
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
            else {
                setError('An unknown error occurred 地图加载失败');
            }
        }
        finally {
            setLoading(false);
        }
    }, [mapAPIKey, containerId]);

    // 获取地图API Key
    useEffect(() => {
        const fetchMapAPIKey = async () => {
            try {
                const response = await axios.get('/api/map');
                const {apikey} = response.data;
                setMapAPIKey(apikey);
            }
            catch (error) {
                let errorMessage = 'An unknown error occurred';
                if (axios.isAxiosError(error)) {
                    // 处理 Axios 错误
                    if (error.response) {
                        errorMessage = `Server error: ${error.response.status} - ${
                            JSON.stringify(error.response.data)
                        }`;
                    }
                    else if (error.request) {
                        errorMessage = 'No response received from server';
                    }
                    else {
                        errorMessage = error.message;
                    }
                }
                else if (error instanceof Error) {
                    errorMessage = error.message;
                }
                setError(errorMessage);
            }
            finally {
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

    return {map, loading, error, mapLoaded};
};
