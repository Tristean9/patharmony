import {StudentSubmitParams} from '@/app/student/components/InfoForm';
import {addReportData} from '@/lib';
import {VehicleType} from '@/types';
import {getNow} from '@/utils';

export async function POST(request: Request) {
    const requestBody = await request.json();
    const {vehicleType, plateNumber, remark, location} = requestBody as StudentSubmitParams;

    // 验证输入信息
    if (!vehicleType || !location) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '信息不完整，请确保填写车辆和位置字段。',
                error: '缺少字段',
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }

    const validVehicleTypes = ['自行车', '电动车', '机动车'];
    if (!validVehicleTypes.includes(vehicleType)) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '车辆类型无效。',
                error: '无效的车辆类型',
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }

    const now = getNow();

    // 创建新的反馈报告数据
    const newReport = {
        vehicleType: vehicleType as VehicleType,
        plateNumber: plateNumber || '',
        remark: remark || '',
        guardRemark: [''],
        location,
        date: now.format('YYYY-MM-DDTHH:mm:ss'),
        confirmed: false,
        processed: false,
    };

    try {
        await addReportData(newReport);
        return new Response(
            JSON.stringify({
                success: true,
                message: '反馈成功',
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '提交失败，请稍后重试。',
                error,
            }),
            {status: 500, headers: {'Content-Type': 'application/json'}}
        );
    }
}
