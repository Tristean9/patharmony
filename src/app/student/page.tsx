'use client'
import InfoForm from "./components/InfoForm";
import MapContainer from "./components/MapContainer";
import Notice from "./components/Notice";

export default function Student() {
    return (
        <div>
            <MapContainer />
            <InfoForm />
            <Notice />
        </div>
    );
};

