import { useEffect } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";

export default function MapContainer() {
    let map: AMap.Map;
    useEffect(() => {
        // window._AMapSecurityConfig = {
        //     serviceHost:'http://113.44.134.238/_AMapService',
        // };
        AMapLoader.load({
            key: "37dd5c21fd9ed2018ae1b97796b0e171", // 申请好的Web端开发者Key，首次调用 load 时必填
            version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        })
            .then((AMap) => {
                map = new AMap.Map("container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [116.397428, 39.90923], // 初始化地图中心点位置
                });
            })
            .catch((e) => {
                console.log(e);
            });
        return () => {
            map?.destroy();
        };
    }, []);

    return (
        <div>


            <div
                id="container"
                style={{ height: "800px" }}
            ></div>
        </div>
    );
}
