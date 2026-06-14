import { getPendingComments } from '@/lib/db/comments';
import { actionApproveComment, actionDeleteComment } from '@/app/actions/comments';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Comment Moderation' };

export default async function AdminCommentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFa = locale === 'fa';
  const pending = await getPendingComments();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">
        {isFa ? 'مدیریت نظرات' : 'Comment Moderation'}
      </h1>

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
