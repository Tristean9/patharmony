import {VehicleType} from './VehicleType';

export interface ReportData {
    reportId: string;
    vehicleType: VehicleType;
    plateNumber: string;
    date: string;
    remark: string;
    guardRemark: string[];
    location: string;
    confirmed: boolean;
    processed: boolean;
}
