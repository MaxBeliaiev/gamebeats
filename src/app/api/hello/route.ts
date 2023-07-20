import { NextResponse } from 'next/server'
import { prisma } from '@/db'

export async function GET(req: Request) {
  const matches = await prisma.match.findMany()

  return NextResponse.json({ hello: matches })
}
