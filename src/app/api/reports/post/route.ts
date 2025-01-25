import {NextRequest, NextResponse} from 'next/server';
import {StudentSubmitParams} from '@/app/user/components/InfoForm';
import {addReportData} from '@/lib';
import {VehicleType} from '@/types';
import {getNow} from '@/utils';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';

export async function POST(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (token?.role !== 'user' && token?.role !== 'guard') {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    const requestBody = await request.json();
    const {vehicleType, plateNumber, remark, position} = requestBody as StudentSubmitParams;

    // 验证输入信息
    if (!vehicleType || !position) {
        return NextResponse.json({
            success: false,
            message: '信息不完整，请确保填写车辆和位置字段。',
            error: '缺少字段',
        }, {status: 400});
    }

    const validVehicleTypes = ['自行车', '电动车', '机动车'];
    if (!validVehicleTypes.includes(vehicleType)) {
        return NextResponse.json({
            success: false,
            message: '车辆类型无效。',
            error: '无效的车辆类型',
        }, {status: 400});
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
        return NextResponse.json({
            success: true,
            message: '反馈成功',
        }, {status: 200});
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: '提交失败，请稍后重试。',
            error,
        }, {status: 500});
    }
}
