import { StudentSubmitParams } from '@/app/student/components/InfoForm';
import { updateReportData } from '@/mocks/tackleData';
import { v4 as uuidv4 } from 'uuid';
import { VehicleType } from '@/types';
import { getNow } from '@/utils';

export async function POST(request: Request) {
    // 手动解析 JSON 请求体
    const requestBody = await request.json();
    const { vehicleType, plateNumber, remark, location } =
		requestBody as StudentSubmitParams;

    // 验证输入信息
    if (!vehicleType || !location) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '信息不完整，请确保填写车辆和位置字段。',
                error: '缺少字段',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
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
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const now = getNow();

    // 创建新的报告数据
    const newReport = {
        reportId: uuidv4(),
        vehicleType: vehicleType as VehicleType,
        plateNumber: plateNumber || '',
        remark: remark || '',
        guardRemark: [''],
        location,
        date: now.format('YYYY-MM-DDTHH:mm:ss'),
        confirmed: false,
        processed: false,
    };

    // 更新报告数据
    updateReportData(newReport);

    return new Response(
        JSON.stringify({
            success: true,
            message: '模拟提交，反馈成功',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
}
