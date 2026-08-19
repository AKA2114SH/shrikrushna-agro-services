// Production System Health & Readiness Check Endpoint
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'unconfigured';
  let dbLatencyMs: number | undefined;

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = 'connected';
    } catch (err: any) {
      dbStatus = 'disconnected';
    }
  }

  const isHealthy = dbStatus !== 'disconnected';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      services: {
        application: 'online',
        database: {
          status: dbStatus,
          ...(dbLatencyMs !== undefined && { latencyMs: dbLatencyMs }),
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
