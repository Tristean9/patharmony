import { deleteReportData } from '@/mocks';

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const reportId = url.pathname.split('/').pop();
    console.log(`Deleting report with ID: ${reportId}`);

    if (reportId) {
        deleteReportData(reportId);

        return new Response(
            JSON.stringify({
                success: true,
                message: '删除成功',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
    } else {
        return new Response(
            JSON.stringify({
                success: false,
                message: '未找到报告ID',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
    }
}
