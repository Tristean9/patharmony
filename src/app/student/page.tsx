'use client'
import { useState } from "react";
import InfoForm from "./components/InfoForm";
import Notice from "./components/Notice";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('./components/MapContainer'), { ssr: false });

export default function Student() {

    const [currentPosition, setCurrentPosition] = useState<string>("");


    return (
        <div>
            <MapContainer setCurrentPosition={setCurrentPosition} />
            <InfoForm location={currentPosition} />
            <Notice />
        </div>
    );
};

