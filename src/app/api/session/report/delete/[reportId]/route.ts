export async function POST(request: Request) {
	console.log(request.body);

	return Response.json({
		success: true,
		message: "删除成功！",
	});
}
