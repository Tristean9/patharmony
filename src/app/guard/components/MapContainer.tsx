import { useEffect, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";
import axios from "axios";
import { MyPosition } from "@/types";

interface MapContainerProps {
    locationsData: string[]
}

const MapContainer: React.FC<MapContainerProps> = ({ locationsData }) => {

    const [mapAPIKey, setMapAPIKey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [locations, setLocations] = useState<MyPosition[]>([])

    useEffect(() => {
        console.log('page组件传递过来的数据');
        console.log(locationsData);

        // 将locationsData的字符串数组 转换成 经纬度的对象
        const formatData = locationsData.map(item => {
            const [latitudeStr, longitudeStr] = item.split(',')
            return {
                longitude: parseFloat(longitudeStr.slice(0, longitudeStr.length - 1)),
                latitude: parseFloat(latitudeStr.slice(0, latitudeStr.length - 1)),
            }
        })

        setLocations(formatData)
        console.log('格式化后的数据');
        console.log(formatData);
    }, [locationsData])

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
                center: [116.308303, 39.988792], // 初始中心点
            });

            locations.forEach(location => {
                console.log([location?.longitude, location?.latitude]);

                //创建一个 Marker 实例：
                const marker = new AMap.Marker({
                    position: [location?.longitude, location?.latitude],
                    title: "当前位置",
                });
                //将创建的点标记添加到已有的地图实例：
                initializedMap.add(marker);
            })

            initializedMap.setZoom(18);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        // 初始化, 获取地图秘钥，获取当前位置
        const initialize = async () => {
            await fetchAPIKey();
        }
        initialize()
    }, []);

    // 当地图秘钥和位置发生变化时，重新加载地图
    useEffect(() => {
        loadMap();
    }, [mapAPIKey, locations]);

    if (loading) return <div>Loading API key...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>


            <div
                id="map-container"
                style={{ height: "500px" }}
            ></div>
        </div>
    );
}

export default MapContainer