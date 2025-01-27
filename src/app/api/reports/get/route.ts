import {getReportData} from '@/lib';
import {authenticate, unauthorizedResponse} from '@/lib/auth';
import {DecodedToken} from '@/types';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const token = await authenticate(request) as DecodedToken;
        if (token?.role !== 'admin' && token?.role !== 'guard') {
            unauthorizedResponse();
        }
    }
    catch {
        unauthorizedResponse();
    }

    const url = new URL(request.url);
    const dateFrom = url.searchParams.get('dateFrom');
    const dateEnd = url.searchParams.get('dateEnd');
    const processedParam = url.searchParams.get('processed');
    const processed = processedParam === null ? undefined : processedParam === 'true';

    if (!dateFrom && !dateEnd) {
        return NextResponse.json({
            success: false,
            message: '缺少日期参数',
            error: '缺少日期参数',
        }, {status: 400});
    }

    try {
        const data = await getReportData(dateFrom as string, dateEnd as string, processed);

        return NextResponse.json({
            success: true,
            message: '查询完成！',
            data,
        }, {status: 200});
    }
    catch (error) {
        return NextResponse.json({
            success: false,
            message: '查询失败',
            error,
        }, {status: 500});
    }
}
