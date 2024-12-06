'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Result, Table } from "antd";
import type { TableProps, TableColumnsType } from 'antd';


export interface GuardInfo {
    reportId: string
    vehicleType: '自行车' | '电动车' | '机动车'
    vehicleId?: string
    violationRemarks?: string;
    location?: string
    hasHandled: '是' | '否'
}

interface DataType extends GuardInfo {
    guardRemark?: string
//     isValid: boolean
//     guardName: string
//     guardRemark?: string

}



export default function Guard() {
    const [error, setError] = useState<string | null>(null);
    const [guardInfo, setGuardInfo] = useState<GuardInfo[]>([])
    const [selectedInfo, setSelectedInfo] = useState<DataType[]>([]); // 用于管理选中行的状态


    useEffect(() => {
        const fetchGuardInfo = async () => {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-guard-info`)
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

    const showAllInfo = () => {
        if (guardInfo) {

            const columns: TableColumnsType<GuardInfo> = [
                {
                    title: '选中',
                    dataIndex: 'handled',
                    key: 'handled',
                    render: (text) => <a>{text}</a>,
                },
                {
                    title: 'report id',
                    dataIndex: 'reportId',
                    key: 'reportId',
                },
                {
                    title: '车辆类型',
                    dataIndex: 'vehicleType',
                    key: 'vehicleType',
                },
            ];

            const rowSelection: TableProps<DataType>['rowSelection'] = {
                onChange: (newSelectedInfo: React.Key[], selectedRows: DataType[]) => {
                    setSelectedInfo(selectedRows); // 更新选中状
                    console.log('selectedRows: ', selectedRows);
                },
                getCheckboxProps: (record: DataType) => ({
                    name: record.reportId,
                }),
                type: 'checkbox'
            };

            return (
                <Table<DataType> columns={columns} rowSelection={rowSelection} dataSource={guardInfo} rowKey="reportId" />
            )
        }
    }

    const showSelectedInfo = () => {
        if (selectedInfo) {

            const columns: TableColumnsType<GuardInfo> = [
                {
                    title: '选中',
                    dataIndex: 'handled',
                    key: 'handled',
                    render: (text) => <a>{text}</a>,
                },
                {
                    title: 'report id',
                    dataIndex: 'reportId',
                    key: 'reportId',
                },
                {
                    title: '车辆类型',
                    dataIndex: 'vehicleType',
                    key: 'vehicleType',
                },
            ];

            return (
                <Table<DataType> columns={columns}  dataSource={selectedInfo} rowKey="reportId" />
            )
        }
    }

    return (
        <div>
            {showError()}
            {showAllInfo()}
            {showSelectedInfo()}
        </div>
    )
};
