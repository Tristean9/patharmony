import { ReportData, UpdateParam } from '@/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export interface ViolationSubmitResponse {
    success: boolean;
    message: string;
    data?: ReportData[];
}

export interface FetchViolationInfo {
    dateFrom: string;
    dateEnd: string;
    processed?: boolean;
}

export const useViolationInfo = ({
    dateFrom,
    dateEnd,
    processed,
}: FetchViolationInfo) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reportData, setReportData] = useState<ReportData[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get<ViolationSubmitResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/getReportList`,
                {
                    params: {
                        dateFrom,
                        dateEnd,
                        processed,
                    },
                },
            );
            const { data, success, message } = response.data;
            if (success && data) {
                setReportData(data);
            } else {
                setError(message);
            }
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(err)) {
                // 处理 Axios 错误
                if (err.response) {
                    // 服务器响应了，但状态码不在 2xx 范围内
                    errorMessage = `Server error: ${
                        err.response.status
                    } - ${JSON.stringify(err.response.data)}`;
                } else if (err.request) {
                    // 请求已经发出，但没有收到响应
                    errorMessage = 'No response received from server';
                } else {
                    // 设置请求时发生了错误
                    errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                // 处理非 Axios 错误
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateEnd, processed]);

    const updateData = useCallback(async (report: UpdateParam) => {
        try {
            const response = await axios.post<ViolationSubmitResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/tackle/${report.reportId}`,
                report,
            );
            const { success, message } = response.data;
            if (success) {
                // 更新数据后重新获取数据
                fetchData();
            } else {
                setError(message);
            }
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    errorMessage = `Server error: ${
                        err.response.status
                    } - ${JSON.stringify(err.response.data)}`;
                } else if (err.request) {
                    errorMessage = 'No response received from server';
                } else {
                    errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    }, [fetchData]);

    const deleteData = useCallback(async (reportId: string) => {
        try {
            const response = await axios.delete<ViolationSubmitResponse>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/session/report/delete/${reportId}`,
            );
            const { success, message } = response.data;
            if (success) {
                fetchData(); // 删除数据后重新获取数据
            } else {
                setError(message);
            }
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    errorMessage = `Server error: ${
                        err.response.status
                    } - ${JSON.stringify(err.response.data)}`;
                } else if (err.request) {
                    errorMessage = 'No response received from server';
                } else {
                    errorMessage = err.message;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { reportData, loading, error, updateData, deleteData };
};
