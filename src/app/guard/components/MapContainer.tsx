import {useCallback, useEffect, useRef} from 'react';
import '@amap/amap-jsapi-types';
import {useMap} from '@/hooks';
import {MyPosition} from '@/types';
import {Alert} from 'antd';

interface MapContainerProps {
    locationsData: string[];
}

const MapContainer: React.FC<MapContainerProps> = ({locationsData}) => {
    const markersRef = useRef<AMap.Marker[]>([]);
    const {map, loading, error, mapLoaded} = useMap('map-container');

    // 将被选中的位置更新到地图上
    const updateMarkers = useCallback((positions: MyPosition[]) => {
        if (typeof window === 'undefined' || !mapLoaded) {
            return;
        }
        const newSet = new Set(positions.map(pos => `${pos.latitude},${pos.longitude}`));

        // 移除不在新数据中的标记
        markersRef.current = markersRef.current.filter(marker => {
            const markerPos = marker.getPosition() as AMap.LngLat;
            const key = `${markerPos.getLat()},${markerPos.getLng()}`;
            if (!newSet.has(key)) {
                marker.remove();
                return false;
            }
            return true;
        });

        // 添加新的标记
        positions.forEach(position => {
            const key = `${position.latitude},${position.longitude}`;
            const exists = markersRef.current.some(marker => {
                const markerPos = marker.getPosition() as AMap.LngLat;
                return key === `${markerPos.getLat()},${markerPos.getLng()}`;
            });
            if (!exists) {
                const marker = new AMap.Marker({
                    position: [position.longitude, position.latitude],
                    title: '当前位置',
                });
                (map.current as AMap.Map).add(marker);
                markersRef.current.push(marker);
            }
        });
    }, [map, mapLoaded]);

    useEffect(() => {
        // 将locationsData的字符串数组 转换成 经纬度的对象
        const formatData = locationsData.map(item => {
            const [latitudeStr, longitudeStr] = item.split(',');
            return {
                longitude: parseFloat(longitudeStr.slice(0, longitudeStr.length - 1)),
                latitude: parseFloat(latitudeStr.slice(0, latitudeStr.length - 1)),
            };
        });
        updateMarkers(formatData);
    }, [locationsData, updateMarkers]);

    if (loading) {
        return <div>loading...</div>;
    }
    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }
    return (
        <div>
            <div
                className="mt-6"
                id="map-container"
                style={{height: '500px'}}
            >
            </div>
        </div>
    );
};

export default MapContainer;
