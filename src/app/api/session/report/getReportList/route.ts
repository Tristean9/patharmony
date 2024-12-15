export async function POST(request: Request) {
	console.log(request.body);

	return Response.json({
		success: true,
		message: "查询完成！",
		data: [
			{
				reportId: "675e6a528f2e14509483a037",
				vehicleType: "自行车",
                plate_number: "",
                remark: "",
                guardRemark: [""],
                location: "36.1234°,116.5678°",
                confirmed: false,
				processed: false,
			},
			{
				reportId: "675e6a528f2e14509483a037",
				vehicleType: "自行车",
                plate_number: "",
                remark: "",
                guardRemark: [""],
                location: "36.1234°,116.5678°",
                confirmed: false,
				processed: false,
			},
			{
				reportId: "675e6a528f2e14509483a037",
				vehicleType: "自行车",
                plate_number: "",
                remark: "",
                guardRemark: [""],
                location: "36.1234°,116.5678°",
                confirmed: false,
				processed: false,
			},
		],
	});
}
