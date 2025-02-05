import {updateReportData} from '@/lib';
import {unauthorizedResponse} from '@/lib/auth';
import {Role} from '@/types';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

export async function PUT(req: NextRequest) {
    const token = await getToken({req});

    if (token?.role !== Role.Admin && token?.role !== Role.Guard) {
        return unauthorizedResponse();
    }

    const updatedReport = await req.json();
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
