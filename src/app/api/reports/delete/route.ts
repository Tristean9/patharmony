import {deleteReportData} from '@/lib';
import {unauthorizedResponse} from '@/lib/auth';
import {Role} from '@/types';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

export async function DELETE(req: NextRequest) {
    const token = await getToken({req});

    if (token?.role !== Role.Admin) {
        return unauthorizedResponse();
    }

    const url = new URL(req.url);
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
