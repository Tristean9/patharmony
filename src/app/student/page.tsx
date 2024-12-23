'use client'
import { useState } from "react";
import InfoForm from "./components/InfoForm";
import Notice from "./components/Notice";
import dynamic from 'next/dynamic';
import Header from "@/components/Header";

const MapContainer = dynamic(() => import('./components/MapContainer'), { ssr: false });

export default function Student() {

    const [currentPosition, setCurrentPosition] = useState<string>("");


    return (
        <div >
            <Header title="违停情况学生反馈提交页面" />
            <MapContainer setCurrentPosition={setCurrentPosition} />
            <InfoForm location={currentPosition} />
            <Notice />
        </div>
    );
};

