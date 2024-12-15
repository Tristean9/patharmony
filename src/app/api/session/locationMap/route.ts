export async function GET() {
    return Response.json({
        apikey: process.env.NEXT_PUBLIC_AMAP_API_KEY,
    })
}