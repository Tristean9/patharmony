import {deleteReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';
import {NextRequest, NextResponse} from 'next/server';

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

    if (!reportId) {
        return NextResponse.json(
            {success: false, error: '缺少报告ID'},
            {status: 400}
        );
    }

    try {
        await deleteReportData(reportId);

        return NextResponse.json(
            {success: true, error: '删除成功'},
            {status: 200}
        );
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : '删除报告失败';
        return NextResponse.json(
            {success: false, error: errorMessage},
            {status: 400}
        );
    }
}
