import {ReportData} from '@/types';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.resolve(process.cwd(), 'src/mocks/data.json');

const readData = (): ReportData[] => {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeData = (data: ReportData[]) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getReportData = (
    dateFrom: string,
    dateEnd: string,
    processed?: boolean,
): ReportData[] => {
    let reportData = readData();

    const fromDate = new Date(dateFrom);
    const EndDate = new Date(dateEnd);
    reportData = reportData.filter(
        (report) =>
            new Date(report.date) >= fromDate
            && new Date(report.date) <= EndDate,
    );

    if (processed !== undefined) {
        reportData = reportData.filter(
            (report) => report.processed === processed,
        );
    }

    return reportData;
};

export const updateReportData = (updatedReport: ReportData) => {
    const reportData = readData();
    const index = reportData.findIndex(
        (report) => report.reportId === updatedReport.reportId,
    );

    if (index !== -1) {
        // 更新现有数据
        reportData[index] = {
            ...reportData[index],
            ...updatedReport,
            guardRemark: [
                ...reportData[index].guardRemark,
                ...(updatedReport.guardRemark || []),
            ],
        };
    }
    else {
        // 添加新数据
        reportData.push(updatedReport as ReportData);
    }

    writeData(reportData);
};

export const deleteReportData = (reportId: string) => {
    let reportData = readData();
    reportData = reportData.filter((report) => report.reportId !== reportId);
    writeData(reportData);
};
