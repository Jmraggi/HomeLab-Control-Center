import { getSystemProvider } from "@/providers/system-provider-factory";
export const dynamic = "force-dynamic";
export async function GET() { return Response.json(await getSystemProvider().getHistory()); }
