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

export interface ReportData {
    reportId: string
    vehicleType: VehicleType
    plateNumber: string
    remark: string;
    guardRemark: string
    location: string
    confirmed: boolean
    processed: boolean
}

export interface GuardSubmitResponse {
    success: boolean;
    message: string;
    data: ReportData[]
}


export default function Guard() {
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<ReportData[]>([])

    // const [selectedInfo, setSelectedInfo] = useState<DataType[]>([]); // 用于管理选中行的状态


    useEffect(() => {
        const fetchGuardInfo = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/getReportList`, {
                    params: {
                        date: getCurrentDate(),
                        processed: false,
                        dateFrom: '00:00:00',
                        dateEnd: '23:59:59'
                    }
                })
                const { data } = response.data
                console.log(data);

                setReportData(data)

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
            
            {showError()}
            <EditableTable reportData={reportData} />
            <MapContainer />
        </div>
    )
};
