'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { upsertUserFromAuth } from '@/lib/db/users';

export async function actionSignInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string) || '/en';
  const locale = next.startsWith('/fa') ? 'fa' : 'en';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error?.message ?? 'Login failed')}`);
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
  const locale = (formData.get('locale') as string) || 'en';

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    redirect(`/${locale}/login?tab=signup&error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && !data.user.email_confirmed_at) {
    redirect(`/${locale}/login?message=check_email`);
  }

  redirect(`/${locale}`);
}

export async function actionSignOut(locale: string = 'en') {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}`);
}

export async function actionSignInWithGoogle(locale: string = 'en') {
  const supabase = await createClient();
  const redirectTo =
    `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/${locale}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error || !data.url) {
    redirect(`/${locale}/login?error=${encodeURIComponent(error?.message ?? 'OAuth failed')}`);
  }

  redirect(data.url);
}
