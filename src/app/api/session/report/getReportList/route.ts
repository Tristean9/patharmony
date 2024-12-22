import { getReportData } from "@/mocks";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const dateFrom = url.searchParams.get("dateFrom");
	const dateEnd = url.searchParams.get("dateEnd");
	const processedParam = url.searchParams.get("processed");
	const processed =
		processedParam === null ? undefined : processedParam === "true";

	if (dateFrom && dateEnd) {
		const data = getReportData(dateFrom, dateEnd, processed);

		return new Response(
			JSON.stringify({
				success: true,
				message: "查询完成！",
				data,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} else {
		return new Response(
			JSON.stringify({
				success: false,
				message: "缺少日期参数",
			}),
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
}
