import {ReportData} from '@/types';
import {Position, VehicleType} from '@/types';
import axios from 'axios';

export interface AddReport {
    vehicleType: VehicleType;
    plateNumber?: string;
    remark?: string;
    position: Position;
}

export interface FetchReports {
    dateFrom: string;
    dateEnd: string;
    processed?: boolean;
}

export interface UpdateReport {
    reportId: string;
    vehicleType?: VehicleType;
    plateNumber?: string;
    remark?: string;
    guardRemark?: string[];
    location?: string;
    confirmed?: boolean;
    processed?: boolean;
}


export async function addReport(submitValues: AddReport) {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/post`,
            submitValues
        );
        const {success, error} = response.data;
        if (success) {
            return {success, error: null};
        }
        return {success: false, error};
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {success: false, error: errorMessage};
    }
}

export async function fetchReports({dateFrom, dateEnd, processed}: FetchReports) {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/get`,
            {
                params: {
                    dateFrom,
                    dateEnd,
                    processed,
                },
            }
        );
        const {data, error} = response.data;

        if (data) {
            const reportData: ReportData[] = data.map((item: any): ReportData => {
                const {_id, ...rest} = item;
                return {reportId: _id, ...rest};
            });
            return {reportData, error: null};
        }
        return {reportData: null, error};
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {reportData: null, error: errorMessage};
    }
}

export async function updateReport(report: UpdateReport) {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/put`,
            report
        );
        const {success, error} = response.data;
        if (success) {
            return {success, error: null};
        }
        return {success: false, error};
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {success: false, error: errorMessage};
    }
}

export async function deleteData(reportId: string) {
    try {
        const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports/delete`,
            {params: {reportId}}
        );
        const {success, error} = response.data;
        if (success) {
            return {success, error: null}; // 删除数据后重新获取数据
        }
        return {success: false, error};
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return {success: false, error: errorMessage};
    }
}
