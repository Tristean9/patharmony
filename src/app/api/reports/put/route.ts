import {updateReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';
import {NextRequest, NextResponse} from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (token?.role !== 'admin' && token?.role !== 'guard') {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    const updatedReport = await request.json();
    const {reportId} = updatedReport;

    if (!reportId) {
        return NextResponse.json(
            {success: false, error: '未找到报告ID'},
            {status: 400}
        );
    }

    try {
        await updateReportData(updatedReport);

        return NextResponse.json(
            {success: true, error: null},
            {status: 200}
        );
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : '更新报告失败';
        return NextResponse.json(
            {success: false, error: errorMessage},
            {status: 400}
        );
    }
}
