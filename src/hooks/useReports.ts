import {ReportData, UpdateParam} from '@/types';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';

export interface SubmitReportResponse {
    success: boolean;
    message: string;
    data?: any[];
}

export interface FetchReports {
    dateFrom: string;
    dateEnd: string;
    processed?: boolean;
}

export const useReports = ({
    dateFrom,
    dateEnd,
    processed,
}: FetchReports) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<ReportData[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get<SubmitReportResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/get`,
                {
                    params: {
                        dateFrom,
                        dateEnd,
                        processed,
                    },
                }
            );
            const {data, success, message} = response.data;

            if (success && data) {
                const reportData = data.map(item => {
                    const {_id, ...rest} = item;
                    return {reportId: _id, ...rest} as ReportData;
                });
                setReportData(reportData);
            }
            else {
                setError(message);
            }
        }
        catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(error)) {
                // 处理 Axios 错误
                if (error.response) {
                    // 服务器响应了，但状态码不在 2xx 范围内
                    errorMessage = `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                }
                else if (error.request) {
                    // 请求已经发出，但没有收到响应
                    errorMessage = 'No response received from server';
                }
                else {
                    // 设置请求时发生了错误
                    errorMessage = error.message;
                }
            }
            else if (error instanceof Error) {
                // 处理非 Axios 错误
                errorMessage = error.message;
            }
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }, [dateFrom, dateEnd, processed]);

    const updateData = useCallback(async (report: UpdateParam) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.put<SubmitReportResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/put`,
                report,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const {success, message} = response.data;
            if (success) {
                // 更新数据后重新获取数据
                fetchData();
            }
            else {
                setError(message);
            }
        }
        catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                }
                else if (error.request) {
                    errorMessage = 'No response received from server';
                }
                else {
                    errorMessage = error.message;
                }
            }
            else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
        }
    }, [fetchData]);

    const deleteData = useCallback(async (reportId: string) => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await axios.delete<SubmitReportResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {reportId},
                }
            );
            const {success, message} = response.data;
            if (success) {
                fetchData(); // 删除数据后重新获取数据
            }
            else {
                setError(message);
            }
        }
        catch (error) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    errorMessage = `Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
                }
                else if (error.request) {
                    errorMessage = 'No response received from server';
                }
                else {
                    errorMessage = error.message;
                }
            }
            else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {reportData, loading, error, updateData, deleteData};
};
