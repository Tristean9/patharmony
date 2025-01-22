import {VehicleType} from './VehicleType';

export interface SubmitReportData {
    vehicleType: VehicleType;
    plateNumber: string;
    date: string;
    remark: string;
    guardRemark: string[];
    location: string;
    confirmed: boolean;
    processed: boolean;
}

export interface ReportData extends SubmitReportData {
    reportId: string;
}
