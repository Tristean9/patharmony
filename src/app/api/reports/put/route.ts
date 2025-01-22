import {updateReportData} from '@/lib';

export async function PUT(request: Request) {
    const updatedReport = await request.json();
    const {reportId} = updatedReport;
    console.log(`Updating report with ID: ${reportId}`);

    if (!reportId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '未找到报告ID',
                error: new Error('Missing report ID'),
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }

    try {
        await updateReportData(updatedReport);

        return new Response(
            JSON.stringify({
                success: true,
                message: '更新成功',
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '更新失败',
                error,
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }
}
