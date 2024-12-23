'use client'
import dynamic from "next/dynamic";
import Header from "@/components/Header";
const EditableTable = dynamic(() => import("./components/EditableTable"), { ssr: false });


export default function Admin() {
    return (
        <div>
            <Header title="违停情况中控处理页面" />
            <EditableTable />
        </div>
    );
}
