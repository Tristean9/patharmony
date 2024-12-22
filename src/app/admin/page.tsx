'use client'
import dynamic from "next/dynamic";
const EditableTable = dynamic(() => import("./components/EditableTable"), { ssr: false });

export default function Admin() {
    return (
        <div>
            <EditableTable />
        </div>
    );
}
