import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, props: { params: Promise<Record<string, string | string[] | undefined>> }) {
  await props.params
  return handlers.GET(req)
}

export async function POST(req: NextRequest, props: { params: Promise<Record<string, string | string[] | undefined>> }) {
  await props.params
  return handlers.POST(req)
}
