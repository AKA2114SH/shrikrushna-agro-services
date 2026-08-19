// Standardized API Response & Production Error Sanitization Helper
import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, any>): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: any
): NextResponse<ApiResponse<null>> {
  // In production, mask internal database or stack trace details
  const isProduction = process.env.NODE_ENV === 'production';
  const sanitizedMessage = isProduction && status === 500 ? 'An unexpected internal server error occurred.' : message;
  const sanitizedDetails = isProduction ? undefined : details;

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message: sanitizedMessage,
        ...(sanitizedDetails && { details: sanitizedDetails }),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}
