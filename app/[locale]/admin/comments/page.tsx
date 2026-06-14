import { getPendingComments } from '@/lib/db/comments';
import { getCommentSettings } from '@/lib/db/settings';
import { actionApproveComment, actionDeleteComment } from '@/app/actions/comments';
import { actionToggleCommentSection } from '@/app/actions/comment-settings';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Comment Moderation' };

export default async function AdminCommentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';

  const [pending, settings] = await Promise.all([getPendingComments(), getCommentSettings()]);

  const sections: { field: 'wordsEnabled' | 'proverbsEnabled' | 'newsEnabled'; en: string; fa: string }[] = [
    { field: 'wordsEnabled',    en: 'Dictionary comments',  fa: 'نظرات واژه‌نامه' },
    { field: 'proverbsEnabled', en: 'Proverb comments',     fa: 'نظرات ضرب‌المثل‌ها' },
    { field: 'newsEnabled',     en: 'News comments',        fa: 'نظرات اخبار' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">
        {isFa ? 'مدیریت نظرات' : 'Comment Moderation'}
      </h1>

      {/* ── Per-section toggles ───────────────────────────────────────────── */}
      <div className="bg-bg border border-primary/20 rounded-2xl p-5 mb-8">
        <h2 className="font-heading text-sm font-semibold text-primary mb-4">
          {isFa ? 'فعال‌سازی نظرات به تفکیک بخش' : 'Enable comments by section'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {sections.map(({ field, en, fa }) => {
            const enabled = settings[field];
            const toggle = actionToggleCommentSection.bind(null, field, !enabled);
            return (
              <form key={field} action={toggle}>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border font-body transition-colors ${
                    enabled
                      ? 'bg-accent text-white border-accent hover:bg-accent-hover'
                      : 'border-primary/30 text-text-muted hover:border-primary hover:text-primary'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${enabled ? 'bg-white' : 'bg-text-muted/40'}`} />
                  {isFa ? fa : en}
                </button>
              </form>
            );
          })}
        </div>
      </div>

      {/* ── Pending queue ────────────────────────────────────────────────── */}
      <h2 className="font-heading text-base font-semibold text-primary mb-4">
        {isFa ? 'در انتظار تأیید' : 'Pending approval'}
        {pending.length > 0 && (
          <span className="ms-2 text-sm font-body font-normal text-text-muted">({pending.length})</span>
        )}
      </h2>

      {pending.length === 0 ? (
        <div className="rounded-2xl border border-primary/20 bg-bg p-8 text-center text-text-muted font-body text-sm">
          {isFa ? 'هیچ نظر در انتظار تأیید وجود ندارد.' : 'No pending comments.'}
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((c) => {
            const targetLabel =
              c.targetType === 'word'
                ? (c.word?.term ?? c.targetId)
                : c.targetType === 'proverb'
                  ? (isFa ? c.proverb?.textFa : c.proverb?.textEn) ?? c.targetId
                  : c.targetId;

            const approve = actionApproveComment.bind(null, c.id, c.targetType, c.targetId);
            const del = actionDeleteComment.bind(null, c.id, c.targetType, c.targetId);

            return (
              <div
                key={c.id}
                className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-primary font-body">{c.user.name}</span>
                      <span className="text-xs text-text-muted font-body">
                        {new Date(c.createdAt).toLocaleDateString(
                          isFa ? 'fa-IR' : 'en-GB',
                          { year: 'numeric', month: 'short', day: 'numeric' },
                        )}
                      </span>
                      <span className="text-xs text-text-muted font-body">
                        {'→ '}
                        <span className="text-primary/70 italic">{targetLabel}</span>
                      </span>
                    </div>
                    <p className="font-body text-sm text-text leading-relaxed">{c.body}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <form action={approve}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg bg-accent text-white font-body hover:bg-accent-hover transition-colors"
                      >
                        {isFa ? 'تأیید' : 'Approve'}
                      </button>
                    </form>
                    <form action={del}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-600 font-body hover:bg-red-50 transition-colors"
                      >
                        {isFa ? 'حذف' : 'Delete'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
