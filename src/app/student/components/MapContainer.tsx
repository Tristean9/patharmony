'use client'
import { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import { Button } from "antd";
import axios from "axios";

// 扩展 AMap.Map 类型
interface ExtendedMap extends AMap.Map {
    reposition?: () => void; // 添加 reposition 方法
}

// 定义  Geolocation 的返回结果
interface GeolocationResult {
    position: AMap.LngLat; // 定位到的经纬度位置
    accuracy: number; // 定位精度，米
    location_type: number; // 定位的类型，ip/h5/sdk/ipcity
    message: string; // 定位过程的信息
    isConverted: boolean; // 是否已经转换为高德坐标
    info: 'SUCCESS' | 'PERMISSION_DENIED' | 'TIME_OUT' | 'POSITION_UNAVAILABLE'; // 定位结果状态
    addressComponent?: string; // 结构化地址信息 (可选)
    formattedAddress?: string; // 规范地址 (可选)
    pois?: string[]; // 定位点附近的POI信息 (可选)
    roads?: string[]; // 定位点附近的道路信息 (可选)
    crosses?: string[]; // 定位点附近的交叉口信息 (可选)
}


const MapContainer: React.FC = () => {
    const [map, setMap] = useState<ExtendedMap | null>(null);
    // const [aMap, setAMap] = useEffect<AMap | null>(null)
    const [mapAPIKey, setMapAPIKey] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 获取地图秘钥
    useEffect(() => {

        const fetchAPIKey = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-map-api`);
                const { AMAP_KEY } = response.data;
                setMapAPIKey(AMAP_KEY);
            } catch (error) {
                setError(axios.isAxiosError(error) ? error.response?.data?.error : "获取高德地图API秘钥失败");
            } finally {
                setLoading(false);
            }
        };

        fetchAPIKey();


    }, []);

    useEffect(() => {
        if (!mapAPIKey) {
            return;
        }

        // 这里可能要换成，从服务器端获取秘钥
        // window._AMapSecurityConfig = {
        // serviceHost: "你的代理服务器域名或地址/_AMapService",
        // };

        AMapLoader.load({
            key: mapAPIKey,
            version: "2.0",
            plugins: ["AMap.Geolocation"],
        })
            .then((AMap) => {
                const initializedMap = new AMap.Map("map-container", {
                    viewMode: "2D",
                    zoom: 11,
                    center: [116.397428, 39.90923], // 初始中心点
                });


                // 初始化 Geolocation 插件
                initializedMap.plugin("AMap.Geolocation", () => {
                    const geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true, // 是否使用高精度定位
                        timeout: 10000, // 超过10秒后停止定位
                        maximumAge: 0, // 定位结果缓存0毫秒
                        convert: true, // 自动偏移坐标
                        showButton: true, // 显示定位按钮
                        buttonPosition: "LB", // 定位按钮停靠位置
                        buttonOffset: new AMap.Pixel(10, 20), // 按钮偏移量
                        showMarker: true, // 显示标记
                        showCircle: true, // 显示定位精度范围
                        panToLocation: true, // 定位成功后将定位到的位置作为地图中心点
                        zoomToAccuracy: true, // 定位成功后调整视野范围
                    });

                    initializedMap.addControl(geolocation);

                    // 获取当前定位
                    geolocation.getCurrentPosition();

                    // 点击重新定位事件
                    const reposition = () => {
                        geolocation.getCurrentPosition((status: string, result: GeolocationResult) => {
                            if (status === "complete") {
                                const { position } = result;
                                initializedMap.setCenter(position);

                                console.log('已经重新定位:', position);

                            } else {
                                console.error(result); // 重新定位失败
                            }
                        });
                    };

                    // 添加重新定位功能到 map 对象
                    initializedMap.reposition = reposition;

                    setMap(initializedMap);
                });
            })
            .catch((e) => {
                console.log(e);
            });

        return () => {
            if (map) {
                map.destroy();
            }
        };
    }, [mapAPIKey]);

    // 重新定位，并设置地图中心点
    const handleReposition = () => {
        if (map && map.reposition) {
            map.reposition();
        }
    };

    if (loading) return <div>Loading API key...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div
                id="map-container"
                className={"map-container"}
                style={{ height: "800px" }}
            ></div>
            <Button onClick={handleReposition}>重新定位</Button>
        </div>
    );
};

export default MapContainer;
