import { useCallback, useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import { MyPosition } from "@/types";
import { fetchMapAPIKey } from "@/utils/fetchMapAPIKey";
import { Alert } from "antd";

interface MapContainerProps {
    locationsData: string[]
}

const MapContainer: React.FC<MapContainerProps> = ({ locationsData }) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const markersRef = useRef<AMap.Marker[]>([])
    const map = useRef(null)

    // 将被选中的位置添加到地图上
    const updateMarkers = useCallback((positions: MyPosition[]) => {
        if (!map.current) {
            return
        }
        // 使用断言来避免类型检查错误
        const mapInstance = map.current as AMap.Map

        const newSet = new Set(positions.map(pos => `${pos.latitude},${pos.longitude}`))

        // 移除不在新数据中的标记
        markersRef.current = markersRef.current.filter(marker => {
            const markerPos = marker.getPosition() as AMap.LngLat
            const key = `${markerPos.getLat()},${markerPos.getLng()}`
            if (!newSet.has(key)) {
                marker.remove()
                return false
            }
            return true
        })

        // 添加新的标记
        positions.forEach(position => {
            const key = `${position.latitude},${position.longitude}`
            const exists = markersRef.current.some(marker => {
                const markerPos = marker.getPosition() as AMap.LngLat
                return key === `${markerPos.getLat()},${markerPos.getLng()}`
            })
            if (!exists) {
                const marker = new AMap.Marker({
                    position: [position.longitude, position.latitude],
                    title: "当前位置",
                });
                //将创建的点标记添加到已有的地图实例：
                mapInstance.add(marker);
                markersRef.current.push(marker)
            }
        })
    }, []) 

    // 加载地图
    const loadMap = useCallback(async (mapAPIKey: string) => {
        if (!mapAPIKey || !location) {
            return
        }

        // 检查 window是否可用
        if (typeof window === "undefined") {
            return;
        }

        try {
            // window._AMapSecurityConfig = {
            //     serviceHost: "你的代理服务器域名或地址/_AMapService",
            //     //例如 ：serviceHost:'http://1.1.1.1:80/_AMapService',
            //   };

            const AMap = await AMapLoader.load({
                key: mapAPIKey,
                version: "2.0",
                plugins: [],
            })
            const initializedMap = new AMap.Map("map-container", {
                viewMode: "2D",
                zoom: 15,
                center: [116.308303, 39.988792], // 初始中心点
            });

            map.current = initializedMap

        } catch (error) {
            console.log(error);
        }
    }, []) 

    useEffect(() => {
        // 初始化, 获取地图秘钥，获取当前位置
        const initialize = async () => {
            const { mapAPIKey, loading, error: mapError } = await fetchMapAPIKey();
            setLoading(loading);
            setError(mapError);
            loadMap(mapAPIKey)
        }
        initialize()
    }, [setLoading, setError, loadMap]);

    useEffect(() => {
        // 将locationsData的字符串数组 转换成 经纬度的对象
        const formatData = locationsData.map(item => {
            const [latitudeStr, longitudeStr] = item.split(',')
            return {
                longitude: parseFloat(longitudeStr.slice(0, longitudeStr.length - 1)),
                latitude: parseFloat(latitudeStr.slice(0, latitudeStr.length - 1)),
            }
        })
        // 更新地图位置标记
        updateMarkers(formatData)
    }, [locationsData, updateMarkers])


    if (loading) return <div>Loading API key...</div>;
    if (error) return <div>Error: {error}</div>;
    if (error) {
        return (
            <Alert
                message={error}
                type="warning"
                closable
            />
        )
    }

    return (
        <div>
            <div
                ref={map}
                id="map-container"
                style={{ height: "500px" }}
            ></div>
        </div>
    );
}

export default MapContainer