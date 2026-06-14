'use server';

import { revalidatePath } from 'next/cache';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import { createSubscriber, deleteSubscriber } from '@/lib/db/newsletter';

async function assertAdmin() {
  const supabaseUser = await getServerUser();
  if (!supabaseUser) throw new Error('Unauthenticated');
  const dbUser = await getUserById(supabaseUser.id);
  if (!dbUser || dbUser.role !== 'admin') throw new Error('Forbidden');
}

export async function actionSubscribe(formData: FormData): Promise<{ error?: string; ok?: boolean }> {
  const email = (formData.get('email') as string).trim().toLowerCase();
  const name = (formData.get('name') as string | null)?.trim() || undefined;
  const locale = (formData.get('locale') as string) || 'fa';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'invalid_email' };
  }

  try {
    await createSubscriber({ email, name, locale });
    return { ok: true };
  } catch {
    return { error: 'server_error' };
  }
}

export async function actionDeleteSubscriber(id: string) {
  await assertAdmin();
  await deleteSubscriber(id);
  revalidatePath('/[locale]/admin/newsletter', 'page');
}

export async function actionSendNewsletter(formData: FormData): Promise<{ error?: string; ok?: boolean; count?: number }> {
  await assertAdmin();

  const subjectEn = (formData.get('subjectEn') as string).trim();
  const subjectFa = (formData.get('subjectFa') as string).trim();
  const bodyEn = (formData.get('bodyEn') as string).trim();
  const bodyFa = (formData.get('bodyFa') as string).trim();

  if (!subjectEn || !bodyEn) return { error: 'missing_fields' };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { error: 'no_api_key' };

  const { getSubscribers } = await import('@/lib/db/newsletter');
  const subscribers = await getSubscribers(true);
  if (subscribers.length === 0) return { error: 'no_subscribers' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://miraha.vercel.app';
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL ?? 'newsletter@miraha.vercel.app';

  let sent = 0;
  for (const sub of subscribers) {
    const isFa = sub.locale === 'fa';
    const subject = isFa && subjectFa ? subjectFa : subjectEn;
    const body = isFa && bodyFa ? bodyFa : bodyEn;
    const unsubscribeUrl = `${appUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}`;

    const html = `
      <div dir="${isFa ? 'rtl' : 'ltr'}" style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c3040;">
        <h2 style="color: #5ba3c9; margin-bottom: 16px;">${subject}</h2>
        <div style="white-space: pre-wrap; line-height: 1.7;">${body}</div>
        <hr style="margin: 32px 0; border-color: #e8f4f9;" />
        <p style="font-size: 12px; color: #4a6a7a;">
          ${isFa ? 'برای لغو اشتراک' : 'To unsubscribe'}: <a href="${unsubscribeUrl}">${isFa ? 'اینجا کلیک کنید' : 'click here'}</a>
        </p>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromEmail, to: sub.email, subject, html }),
    });

    if (res.ok) sent++;
  }

  return { ok: true, count: sent };
}
