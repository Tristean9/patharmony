export async function POST(request: Request) {
	// 可能要验证一下保安的身份信息
	console.log(request.body);

	return Response.json([
		{
			reportId: 1000234,
			vehicleType: "自行车",
			handled: false,
		},
		{
			reportId: 1000235,
			vehicleType: "电动车",
			handled: false,
		},
		{
			reportId: 1000236,
			vehicleType: "机动车",
			vehicleId: "ABC123",
			handled: false,
		},
	]);
}
