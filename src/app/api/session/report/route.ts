import { StudentSubmitParams } from "@/app/student/components/InfoForm";

export async function POST(request: Request) {
	// 手动解析 JSON 请求体
	const requestBody = await request.json();
	const { vehicleType } = requestBody as StudentSubmitParams;

	console.log("提交的违停信息:", requestBody);

	// 验证输入信息
	if (!vehicleType) {
		console.log("提交失败：信息不完整", requestBody);
		return Response.json({
			success: false,
			message: "信息不完整，请确保填写车辆字段。",
			error: "缺少字段",
		});
	}

	// 其他验证 (例如，车辆类型是否有效)
	const validVehicleTypes = ["自行车", "电动车", "机动车"];
	if (!validVehicleTypes.includes(vehicleType)) {
		console.log("提交失败：车辆类型无效", requestBody);
		return Response.json({
			success: false,
			message: "车辆类型无效。",
			error: "无效的车辆类型",
		});
	}

	return Response.json({
		success: true,
		message: "模拟提交，反馈成功",
	});
}
