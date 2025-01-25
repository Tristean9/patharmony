import {NextRequest, NextResponse} from 'next/server';
import {deleteReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';

export async function DELETE(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (token?.role !== 'admin') {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    const url = new URL(request.url);
    const reportId = url.searchParams.get('reportId');
    console.log(`Deleting report with ID: ${reportId}`);

    if (reportId) {
        try {
            await deleteReportData(reportId);

            return NextResponse.json({
                success: true,
                message: '删除成功',
            }, {status: 200});
        }
        catch (error) {
            return NextResponse.json({
                success: false,
                message: '删除失败',
                error,
            }, {status: 400});
        }
    }
    else {
        return NextResponse.json({
            success: false,
            message: '未找到报告ID',
            error: '缺少报告ID',
        }, {status: 400});
    }
}
