export async function GET(request: Request) {
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
				location: "39.988792°,116.308303°",
				confirmed: false,
				processed: false,
			},
			{
				reportId: "675e6a528f2e14ee9483a037",
				vehicleType: "自行车",
				plate_number: "",
				remark: "",
				guardRemark: [""],
				location: "39.988729°,116.30719°",
				confirmed: false,
				processed: false,
			},
			{
				reportId: "675e6a528f2e85509483a037",
				vehicleType: "自行车",
				plate_number: "",
				remark: "",
				guardRemark: [""],
				location: "39.987394°,116.308532°",
				confirmed: false,
				processed: false,
			},
		],
	});
}
