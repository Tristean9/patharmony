import {getReportData} from '@/lib';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const dateFrom = url.searchParams.get('dateFrom');
    const dateEnd = url.searchParams.get('dateEnd');
    const processedParam = url.searchParams.get('processed');
    const processed = processedParam === null ? undefined : processedParam === 'true';

    if (!dateFrom && !dateEnd) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '缺少日期参数',
                error: new Error('Missing date parameters'),
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }

    try {
        const data = await getReportData(dateFrom as string, dateEnd as string, processed);

        return new Response(
            JSON.stringify({
                success: true,
                message: '查询完成！',
                data,
            }),
            {status: 200, headers: {'Content-Type': 'application/json'}}
        );
    }
    catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: '查询失败',
                error,
            }),
            {status: 400, headers: {'Content-Type': 'application/json'}}
        );
    }
}
