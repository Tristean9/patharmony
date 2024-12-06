import { http, HttpResponse } from "msw";

interface ViolationInfo {
	vehicleType?: string;
	violationRemarks?: string;
	vehicleId?: string;
}

export const handlers = [
	http.get("/api/get-map-api", () => {
		return HttpResponse.json({
			AMAP_KEY: "37dd5c21fd9ed2018ae1b97796b0e171",
			AMAP_SECURITY_JS_CODE: "4bffedc3a6694cb3490719e29c24dd71",
		});
	}),
	http.post("/api/submit-violation-info", async ({ request }) => {
		// 手动解析 JSON 请求体
		const requestBody = await request.json();
		const { vehicleType, violationRemarks, vehicleId } =
			requestBody as ViolationInfo;

		console.log("提交的违停信息:", requestBody);

		// 验证输入信息
		if (!vehicleType || !violationRemarks || !vehicleId) {
			console.log("提交失败：信息不完整", requestBody);
			return HttpResponse.json({
				success: false,
				message: "信息不完整，请填写所有字段。",
				error: "缺少字段",
			});
		}

		// 其他验证 (例如，车辆类型是否有效)
		const validVehicleTypes = ["自行车", "电动车", "机动车"];
		if (!validVehicleTypes.includes(vehicleType)) {
			console.log("提交失败：车辆类型无效", requestBody);
			return HttpResponse.json({
				success: false,
				message: "车辆类型无效。",
				error: "无效的车辆类型",
			});
		}

		// 如果所有验证通过，返回成功响应
		return HttpResponse.json({
			success: true,
			message: "违停信息提交成功",
			error: null,
		});
	}),
];
