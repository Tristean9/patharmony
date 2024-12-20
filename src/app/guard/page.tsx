'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Result } from "antd";
import EditableTable from "./components/EditableTable";
import { SubmitResponse, VehicleType, UpdateParam } from "@/types";
import { getCurrentDate } from "@/utils";
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('./components/MapContainer'), { ssr: false });

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
    data?: ReportData[]
}


export default function Guard() {

    const [loading, setLoading] = useState<boolean>(true);
    const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string>('');

    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string>('');

    const [reportData, setReportData] = useState<ReportData[]>([])

    const [selectedLocation, setSelectedLocation] = useState<string[]>([]); // 用于收到表格组件传递的数据
    const [locationsData, setLocationsData] = useState<string[]>([]); // 用于给地图组件传递数据

    const fetchGuardInfo = async () => {
        let reportData: ReportData[] = []
        let fetchError: string = ''
        try {
            const date = getCurrentDate()
            console.log('发送获取当天数据请求');
            
            const response = await axios.get<GuardSubmitResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/getReportList`, {
                params: {
                    processed: false,
                    dateFrom: `${date}T00:00:00`,
                    dateEnd: `${date}T23:59:59`
                }
            })
            const { data, success, message } = response.data
            if (success && data) {
                reportData = data
                console.log('获取到的数据：', data);
            }
            else {
                fetchError = message
            }

        } catch (error) {
            fetchError = axios.isAxiosError(error) ? error.response?.data?.error : "获取今日违停信息失败"
        }
        setLoading(false)
        return {
            data: reportData,
            fetchError
        }
    };

    useEffect(() => {
        const initialize = async () => {
            const { data, fetchError } = await fetchGuardInfo();
            setReportData(data);
            setFetchError(fetchError);
            setFetchSuccess(true);
        }
        initialize();
    }, [])

    const handleSave = async (report: UpdateParam) => {
        console.log('将要保存的数据: ', report);

        // 想服务器发送请求，更新记录
        try {
            const response = await axios.post<SubmitResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/tackle/${report.reportId}`, report);
            const { success, message } = response.data;
            setSubmitSuccess(success);
            setSubmitError(message);


        } catch (error) {
            setSubmitError(axios.isAxiosError(error) ? error.response?.data?.error : "提交违停信息失败")
        }
    }

    const handleRefreshData = async () => {
        // 提交成功后，重新获取数据
        const { data, fetchError } = await fetchGuardInfo();
        setReportData(data);
        setFetchError(fetchError);
        setFetchSuccess(true);
        setSubmitSuccess(false);
        setSubmitError('');
    }


    const showFetchError = () => {
        return <>
            {
                !fetchSuccess && <Result
                    status="error"
                    title="获取今日违停信息失败"
                    subTitle={fetchError}
                />
            }
        </>
    };

    const showSubmitError = () => {
        return <>
            {!submitSuccess && submitError && <Result
                status="error"
                title="保存失败"
                subTitle={submitError}
            />}
        </>
    };

    const showSubmitSuccess = () => {
        return <>
            {submitSuccess && <Result
                status="success"
                title="保存成功"
                subTitle={'保存成功'}
                extra={[
                    <Button type="primary" key="console" onClick={handleRefreshData}>
                        刷新数据
                    </Button>
                ]}
            />}
        </>
    };

    // 给子组件调用的方法
    const handleSelectedLocation = (selectedLocation: string[]) => {
        setSelectedLocation(selectedLocation)
    }

    const handleLocationAddMarker = () => {
        setLocationsData(selectedLocation)
    }

    const showTable = () => {
        return <>
            {fetchSuccess && !fetchError && <EditableTable reportData={reportData} handleSelectedLocation={handleSelectedLocation} handleSave={handleSave} />
            }
        </>
    }

    if (loading) return <div>Loading API key...</div>;

    return (
        <div>
            {showFetchError()}
            {showSubmitError()}
            {showSubmitSuccess()}
            {showTable()}
            <Button onClick={handleLocationAddMarker}>将选中的记录显示在地图上</Button>
            <MapContainer locationsData={locationsData} />
        </div>
    )
};
