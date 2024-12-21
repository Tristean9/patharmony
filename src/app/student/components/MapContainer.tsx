'use client'
import { useCallback, useEffect, useState } from "react";
import "@amap/amap-jsapi-types";
import { MyPosition } from "@/types";
import { Alert, Typography } from 'antd';
import { getCurrentLocation } from "@/utils/";
import { useMap } from "@/hooks/";

interface MapContainerProps {
    setCurrentPosition: (position: string) => void;
}


const MapContainer: React.FC<MapContainerProps> = ({ setCurrentPosition }) => {

    const [, setPosition] = useState<MyPosition | null>(null);
    const { map, loading, error, mapLoaded } = useMap("map-container");

    const updatePosition = useCallback((newPosition: MyPosition) => {
        setPosition(newPosition);
        setCurrentPosition(`${newPosition.longitude}°,${newPosition.latitude}°`);
    }, [setCurrentPosition, setPosition])

    // 加载地图
    const updateMarker = useCallback(async () => {

        if (typeof window === "undefined" || !mapLoaded) {
            return;
        }

        const { position } = await getCurrentLocation();
        const initPosition = position ?? { latitude: 39.988792, longitude: 116.308303 };

        try {
            //创建一个 Marker 实例：
            const marker: AMap.Marker = new AMap.Marker({
                position: [initPosition.longitude, initPosition.latitude], //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: "当前位置",
                draggable: true,
            });
            console.log('marker', marker);

            updatePosition(initPosition);

            (map.current as AMap.Map).add(marker);
            // 给 marker 添加事件监听，拖拽后更新位置
            marker.on("dragend", () => {
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
    }, [updatePosition, map, mapLoaded])


    useEffect(() => {
        updateMarker()
    }, [updateMarker]);


    if (loading) {
        return <div>Loading map...</div>;
    }

    if (error) {
        return <Alert message={error} type="warning" closable />
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
