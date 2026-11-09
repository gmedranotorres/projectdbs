import { readNewestPlan } from "@/lib/plan";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await readNewestPlan(), { headers: { "Cache-Control": "no-store" } });
}
