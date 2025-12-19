import { fetchTenantPage } from "@/lib/payload"
import { NextRequest } from "next/server"

export const dynamic = 'force-static'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ tenant: string; page: string }> }) {
    const { tenant, page } = await params
    const res = await fetchTenantPage(tenant, page)
    const data = await res.json()

    return Response.json({ data })
}