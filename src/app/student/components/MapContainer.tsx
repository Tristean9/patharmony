'use client'
import { useCallback, useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import { MyPosition } from "@/types";
import { Alert, Typography } from 'antd';
import { getLocation } from "@/utils/getLocation";
import { fetchMapAPIKey } from "@/utils/fetchMapAPIKey";

interface MapContainerProps {
    setCurrentPosition: (position: string) => void;
}


const MapContainer: React.FC<MapContainerProps> = ({ setCurrentPosition }) => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [, setPosition] = useState<MyPosition | null>(null);

    const updatePosition = useCallback((newPosition: MyPosition) => {
        setPosition(newPosition);
        setCurrentPosition(`${newPosition.longitude}°,${newPosition.latitude}°`);
    }, [setCurrentPosition, setPosition])

    // 加载地图
    const loadMap = useCallback(async (mapAPIKey: string, initialPosition: MyPosition | null) => {
        if (!mapAPIKey || !initialPosition) {
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
                zoom: 18,
                center: [initialPosition.longitude, initialPosition.latitude], // 初始中心点
            });

            //创建一个 Marker 实例：
            const marker: AMap.Marker = new AMap.Marker({
                position: [initialPosition.longitude, initialPosition.latitude], //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: "当前位置",
                draggable: true,
            });

            updatePosition(initialPosition)

            //将创建的点标记添加到已有的地图实例：
            initializedMap.add(marker);

            // 给 marker 添加事件监听，拖拽后更新位置
            marker.on("dragend", function () {
                const markerPos = marker.getPosition() as AMap.LngLat
                console.log("dragend", markerPos);
                const newPosition = {
                    latitude: markerPos.getLat(),
                    longitude: markerPos.getLng(),
                };
                updatePosition(newPosition)
            });

        } catch (error) {
            console.log(error);
        }
    }, [updatePosition])


    useEffect(() => {
        // 初始化, 获取地图秘钥，获取当前位置
        const initialize = async () => {
            const { mapAPIKey, loading, error: mapError } = await fetchMapAPIKey();
            setLoading(loading);
            setError(mapError);
            const { position, error: locationError } = await getLocation()
            setError(locationError);
            loadMap(mapAPIKey, position);
        }
        initialize()
    }, [loadMap, updatePosition, setError, setLoading]);


    if (loading) return <div>Loading API key...</div>;

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
            <Typography.Title level={5}>请拖拽地图或移动标记，获取您想提交的违停精确位置</Typography.Title>
            <div
                id="map-container"
                className={"map-container"}
                style={{ height: "350px" }}
            ></div>
        </div>
    );
};

export default MapContainer;
