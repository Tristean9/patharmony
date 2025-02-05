import {AddReport} from '@/api/reports';
import {addReportData} from '@/lib';
import {unauthorizedResponse} from '@/lib/auth';
import {Role, VehicleType} from '@/types';
import {getNow} from '@/utils';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
    const token = await getToken({req});

    if (token?.role !== Role.Admin && token?.role !== Role.Guard && token?.role !== Role.User) {
        return unauthorizedResponse();
    }

    const requestBody = await req.json();
    const {vehicleType, plateNumber, remark, position} = requestBody as AddReport;

    // 验证输入信息
    if (!vehicleType || !position) {
        return NextResponse.json(
            {success: false, error: '信息不完整，请确保填写车辆和位置字段。'},
            {status: 400}
        );
    }

    const validVehicleTypes = ['自行车', '电动车', '机动车'];
    if (!validVehicleTypes.includes(vehicleType)) {
        return NextResponse.json(
            {success: false, error: '无效的车辆类型'},
            {status: 400}
        );
    }

    const now = getNow();

    // 创建新的反馈报告数据
    const newReport = {
        vehicleType: vehicleType as VehicleType,
        plateNumber: plateNumber || '',
        remark: remark || '',
        guardRemark: [''],
        position,
        date: now.format(),
        confirmed: false,
        processed: false,
    };

    try {
        await addReportData(newReport);
        return NextResponse.json(
            {success: true, error: null},
            {status: 200}
        );
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : '创建报告失败';
        return NextResponse.json(
            {success: false, error: errorMessage},
            {status: 500}
        );
    }
}
