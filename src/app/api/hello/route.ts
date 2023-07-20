import { NextResponse } from 'next/server'
import { prisma } from '@/db'
import { getAuthSession } from '@/lib/auth'

export async function GET(req: Request) {
  const session = getAuthSession()
  const matches = await prisma.match.findMany()

  return NextResponse.json({ hello: matches })
}
