import {UserSubmitParams} from '@/app/user/components/InfoForm';
import {addReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {VehicleType} from '@/types';
import {DecodedToken} from '@/types';
import {getNow} from '@/utils';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (!token.role) {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    const requestBody = await request.json();
    const {vehicleType, plateNumber, remark, position} = requestBody as UserSubmitParams;

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
        return NextResponse.json(
            {success: false, error},
            {status: 500}
        );
    }
}
