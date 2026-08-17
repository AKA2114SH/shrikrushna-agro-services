import { NextRequest, NextResponse } from 'next/server';
import { handleOwnerAIQuery } from '@/lib/ai-owner';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canAccessOwnerAI')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'OWNER_AI',
        newData: { reason: `Role ${user.role} attempted to query Owner AI.` },
      });
      return NextResponse.json(
        { error: 'Forbidden: Only Business Owner has access to private AI Business Assistant.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required.' }, { status: 400 });
    }

    const result = await handleOwnerAIQuery({ query });

    await logAuditEvent({
      user,
      action: 'OWNER_AI_QUERY',
      entity: 'AI_ASSISTANT',
      newData: { query, toolUsed: result.toolUsed },
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing Owner AI query' }, { status: 500 });
  }
}
