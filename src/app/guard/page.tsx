'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Result } from "antd";
import EditableTable from "./components/EditableTable";
import { VehicleType } from "@/types";
import { getCurrentDate } from "@/utils";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('./components/MapContainer'), { ssr: false });

export interface GuardSubmitParams {
    dateRange: string
    handled: boolean
}


export interface GuardSubmitResponse {
    reportId: string
    vehicleType: VehicleType
    plateNumber: string
    remark: string;
    guardRemark: string
    location: string
    confirmed: boolean
    handled: boolean
}


export default function Guard() {
    const [error, setError] = useState<string | null>(null);
    const [guardInfo, setGuardInfo] = useState<GuardSubmitResponse[]>([])
    console.log(guardInfo);


    // const [selectedInfo, setSelectedInfo] = useState<DataType[]>([]); // 用于管理选中行的状态


    useEffect(() => {
        const fetchGuardInfo = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/session/reports/getReportList`, {
                    date: getCurrentDate(),
                    handled: false,
                    dateFrom: '00:00:00',
                    dateEnd: '23:59:59'
                })
                const { data } = response
                console.log(data);

                setGuardInfo(data)

            } catch (error) {
                setError(axios.isAxiosError(error) ? error.response?.data?.error : "获取今日违停信息失败");
            }
        };
        fetchGuardInfo();
    }, [])

    const showError = () => {
        if (error) {
            return (
                <Result
                    status="error"
                    title="提交失败"
                    subTitle={error}
                />
            );
        }
    };


    return (
        <div>
            <MapContainer />
            {showError()}
            <EditableTable />
        </div>
    )
};
