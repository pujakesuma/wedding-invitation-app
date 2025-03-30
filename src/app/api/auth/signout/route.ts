// src/app/api/auth/signout/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to the home page
  return NextResponse.redirect(new URL('/', request.url));
}