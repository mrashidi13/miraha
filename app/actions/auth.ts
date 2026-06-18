'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { upsertUserFromAuth } from '@/lib/db/users';

function loginPath(locale: string) {
  return locale === 'en' ? '/en/login' : '/login';
}
function homePath(locale: string) {
  return locale === 'en' ? '/en' : '/';
}

export async function actionSignInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string) || '/';
  const locale = next.startsWith('/en') ? 'en' : 'fa';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`${loginPath(locale)}?error=${encodeURIComponent(error?.message ?? 'Login failed')}`);
  }

  const name =
    data.user.user_metadata?.full_name ??
    data.user.user_metadata?.name ??
    email.split('@')[0];

  await upsertUserFromAuth(data.user.id, email, name);
  redirect(next);
}

export async function actionSignUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = (formData.get('name') as string) || email.split('@')[0];
  const locale = (formData.get('locale') as string) || 'fa';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    redirect(`${loginPath(locale)}?tab=signup&error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && !data.user.email_confirmed_at) {
    redirect(`${loginPath(locale)}?message=check_email`);
  }

  redirect(homePath(locale));
}

export async function actionSignOut(locale: string = 'fa') {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(homePath(locale));
}

export async function actionSignInWithGoogle(locale: string = 'fa') {
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${homePath(locale)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) {
    redirect(`${loginPath(locale)}?error=${encodeURIComponent(error?.message ?? 'OAuth failed')}`);
  }

  redirect(data.url);
}

// ── SMS / Phone OTP ───────────────────────────────────────────────────────────

export async function actionRequestSmsOtp(
  phone: string,
  locale: string,
): Promise<{ error?: string }> {
  const normalized = phone.trim().replace(/^0/, '+98');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone: normalized });

  if (error) return { error: error.message };
  return {};
}

export async function actionSyncPhoneUser(userId: string, phone: string, name: string) {
  await upsertUserFromAuth(userId, '', name || phone);
}
