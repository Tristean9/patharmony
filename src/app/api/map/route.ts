export async function GET() {
    return Response.json({
        apikey: process.env.AMAP_API_KEY,
    });
}
