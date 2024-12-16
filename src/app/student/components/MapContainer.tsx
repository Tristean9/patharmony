'use client'
import { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import { Button } from "antd";
import axios from "axios";
import { MyLocation } from "@/types";

interface MapContainerProps {
    setCurrentPosition: (position: string) => void;
}


const MapContainer: React.FC<MapContainerProps> = ({ setCurrentPosition }) => {

    const [mapAPIKey, setMapAPIKey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<MyLocation>({ latitude: 39.9042, longitude: 116.4074 });

    const handlePositionChange = (newPosition: string) => {
        if (setCurrentPosition) {
            setCurrentPosition(newPosition);
        }
    };

    // 获取当前定位
    const getLocation = () => {
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    // console.log("当前位置:", `${position.coords.longitude},${position.coords.latitude}`);

                    handlePositionChange(`${position.coords.latitude}°,${position.coords.longitude}°`);
                    setError(null);
                },
                (err) => {
                    setError(err.message);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    const fetchAPIKey = async () => {
        try {
            const response = await axios.get(`/api/session/locationMap`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const { apikey } = response.data;

            setMapAPIKey(apikey);
        } catch (error) {
            setError(axios.isAxiosError(error) ? error.response?.data?.error : "获取高德地图API秘钥失败");
        } finally {
            setLoading(false);
        }
    };


    // 加载地图
    const loadMap = async () => {

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
                zoom: 11,
                center: [location?.longitude, location?.latitude], // 初始中心点
            });

            //创建一个 Marker 实例：
            const marker = new AMap.Marker({
                position: [location?.longitude, location?.latitude], //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                title: "当前位置",
            });
            //将创建的点标记添加到已有的地图实例：
            initializedMap.add(marker);
            initializedMap.setZoom(18);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // 初始化, 获取地图秘钥，获取当前位置
        const initialize = async () => {
            await fetchAPIKey();
            await getLocation();
        }
        initialize()
    }, []);

    // 当地图秘钥和位置发生变化时，重新加载地图
    useEffect(() => {
        loadMap();
    }, [mapAPIKey, location]);


    // 重新定位，并设置地图中心点
    const handleReposition = async () => {
        getLocation();
        loadMap();
    };

    if (loading) return <div>Loading API key...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div
                id="map-container"
                className={"map-container"}
                style={{ height: "350px" }}
            ></div>
            <Button onClick={handleReposition}>重新定位</Button>
        </div>
    );
};

export default MapContainer;
