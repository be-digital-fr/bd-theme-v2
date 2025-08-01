import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth.handler);

// Add CORS handling
function addCorsHeaders(response: Response, origin?: string) {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ];

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', allowedOrigins.includes(origin || '') ? origin! : 'http://localhost:3000');
  newHeaders.set('Access-Control-Allow-Credentials', 'true');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = await handler.GET(request);
  return addCorsHeaders(response, origin || undefined);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = await handler.POST(request);
  return addCorsHeaders(response, origin || undefined);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001'
  ];

  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin || '') ? origin! : 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    },
  });
}