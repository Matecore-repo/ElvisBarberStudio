import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, props: { params: Promise<any> }) {
  await props.params
  return handlers.GET(req)
}

export async function POST(req: NextRequest, props: { params: Promise<any> }) {
  await props.params
  return handlers.POST(req)
}
