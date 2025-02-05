import {getReportData} from '@/lib';
import {unauthorizedResponse} from '@/lib/auth';
import {Role} from '@/types';
import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    const token = await getToken({req});

    if (token?.role !== Role.Admin && token?.role !== Role.Guard) {
        return unauthorizedResponse();
    }

    const url = new URL(req.url);
    const dateFrom = url.searchParams.get('dateFrom');
    const dateEnd = url.searchParams.get('dateEnd');
    const processedParam = url.searchParams.get('processed');
    const processed = processedParam === null ? undefined : processedParam === 'true';

    if (!dateFrom && !dateEnd) {
        return NextResponse.json(
            {data: null, error: '缺少日期参数'},
            {status: 400}
        );
    }

    try {
        const data = await getReportData(dateFrom as string, dateEnd as string, processed);

        return NextResponse.json(
            {data, error: null},
            {status: 200}
        );
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : '获取报告失败';
        return NextResponse.json(
            {data: null, error: errorMessage},
            {status: 500}
        );
    }
}
