import {deleteReportData} from '@/lib';

export async function DELETE(request: Request) {
    const url = new URL(request.url);
    const reportId = url.searchParams.get('reportId');
    console.log(`Deleting report with ID: ${reportId}`);

    if (reportId) {
        try {
            await deleteReportData(reportId);

            return new Response(
                JSON.stringify({
                    success: true,
                    message: '删除成功',
                }),
                {status: 200, headers: {'Content-Type': 'application/json'}}
            );
        }
        catch (error) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: '删除失败',
                    error,
                }),
                {status: 400, headers: {'Content-Type': 'application/json'}}
            );
        }
    }
    else {
        return new Response(
            JSON.stringify({
                success: false,
                message: '未找到报告ID',
                error: new Error('Missing report ID'),
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }
}
