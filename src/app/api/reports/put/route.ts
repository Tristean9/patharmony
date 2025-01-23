import {NextRequest, NextResponse} from 'next/server';
import {updateReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';

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
