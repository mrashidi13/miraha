import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { upsertUserFromAuth } from '@/lib/db/users';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/en';

  if (!code) {
    return NextResponse.redirect(`${origin}/en/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/en/login?error=auth_failed`);
  }

  // Sync with our DB
  const email = data.user.email ?? '';
  const name =
    data.user.user_metadata?.full_name ??
    data.user.user_metadata?.name ??
    email.split('@')[0];
  const avatarUrl = data.user.user_metadata?.avatar_url;

  await upsertUserFromAuth(data.user.id, email, name, avatarUrl);

  return NextResponse.redirect(`${origin}${next}`);
}
