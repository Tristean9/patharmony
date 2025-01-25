import {VehicleType} from './VehicleType';

export interface UpdateParam {
    reportId: string;
    vehicleType?: VehicleType;
    plateNumber?: string;
    remark?: string;
    guardRemark?: string[];
    location?: string;
    confirmed?: boolean;
    processed?: boolean;
}
