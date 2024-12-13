'use client'
import { useState } from "react";
import InfoForm from "./components/InfoForm";
import MapContainer from "./components/MapContainer";
import Notice from "./components/Notice";

export default function Student() {

    const [currentPosition, setCurrentPosition] = useState<string>("");


    return (
        <div> 
            <MapContainer setCurrentPosition={setCurrentPosition} />
            <InfoForm  location={currentPosition} />
            <Notice />
        </div>
    );
};

