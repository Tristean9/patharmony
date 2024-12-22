import { updateReportData } from "@/mocks";

export async function POST(request: Request) {
    const updatedReport = await request.json();
    console.log(updatedReport);

    updateReportData(updatedReport);

    return new Response(
        JSON.stringify({
            success: true,
            message: "更新成功",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}