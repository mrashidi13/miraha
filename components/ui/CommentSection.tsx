import { getApprovedComments, getAllCommentsForTarget } from '@/lib/db/comments';
import { actionAddComment, actionApproveComment, actionDeleteComment } from '@/app/actions/comments';
import { getServerUser } from '@/lib/supabase/server';
import { getUserById } from '@/lib/db/users';
import { Link } from '@/i18n/navigation';
import { SubmitButton } from '@/components/admin/SubmitButton';
import type { TargetType } from '@prisma/client';

interface Props {
  targetType: TargetType;
  targetId: string;
  locale: string;
  showSuccess?: boolean;
}

export async function CommentSection({ targetType, targetId, locale, showSuccess }: Props) {
  const isFa = locale === 'fa';

  const supabaseUser = await getServerUser();
  const dbUser = supabaseUser ? await getUserById(supabaseUser.id) : null;
  const canModerate = dbUser?.role === 'admin' || dbUser?.canModerateComments === true;

  const comments = canModerate
    ? await getAllCommentsForTarget(targetType, targetId)
    : await getApprovedComments(targetType, targetId);

  const addComment = actionAddComment.bind(null, targetType, targetId, locale);

  return (
    <div className="mt-10 border-t border-primary/10 pt-8">
      <h2 className="font-heading text-lg font-semibold text-primary mb-5">
        {isFa ? 'نظرات' : 'Comments'}
        {comments.length > 0 && (
          <span className="ms-2 text-sm font-body text-text-muted font-normal">
            ({comments.filter((c) => c.status === 'approved').length})
          </span>
        )}
      </h2>

      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-sm text-text-muted font-body mb-6">
          {isFa ? 'هنوز نظری ثبت نشده.' : 'No comments yet.'}
        </p>
      ) : (
        <div className="space-y-3 mb-6">
          {comments.map((c) => {
            const isPending = c.status === 'pending';
            const approve = actionApproveComment.bind(null, c.id, targetType, targetId);
            const del = actionDeleteComment.bind(null, c.id, targetType, targetId);
            return (
              <div
                key={c.id}
                className={`rounded-xl px-4 py-3 border ${
                  isPending
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-primary/20 bg-primary-light'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-body text-xs font-semibold text-primary">{c.user.name}</span>
                      <span className="text-xs text-text-muted font-body">
                        {new Date(c.createdAt).toLocaleDateString(
                          isFa ? 'fa-IR' : 'en-GB',
                          { year: 'numeric', month: 'short', day: 'numeric' },
                        )}
                      </span>
                      {isPending && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-body border border-yellow-200">
                          {isFa ? 'در انتظار تأیید' : 'Pending'}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-text leading-relaxed">{c.body}</p>
                  </div>

                  {/* Moderator actions on pending comments */}
                  {canModerate && isPending && (
                    <div className="flex gap-2 flex-shrink-0 mt-0.5">
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
                  )}

                  {/* Moderator delete on approved comments */}
                  {canModerate && !isPending && (
                    <form action={del} className="flex-shrink-0 mt-0.5">
                      <button
                        type="submit"
                        className="text-xs text-red-400 hover:text-red-600 font-body transition-colors"
                        title={isFa ? 'حذف' : 'Delete'}
                      >
                        ×
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Success message */}
      {showSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-accent/10 border border-accent/30 text-sm font-body text-accent">
          {isFa
            ? 'نظر شما دریافت شد و پس از تأیید نمایش داده می‌شود.'
            : 'Your comment has been submitted and will appear after review.'}
        </div>
      )}

      {/* Add comment */}
      {supabaseUser ? (
        <form action={addComment} className="space-y-3">
          <textarea
            name="body"
            dir="auto"
            rows={3}
            required
            placeholder={isFa ? 'نظر خود را بنویسید…' : 'Write your comment…'}
            className="w-full rounded-xl border border-primary/30 bg-bg px-4 py-3 font-body text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
          />
          <div className="flex items-center gap-4">
            <SubmitButton label={isFa ? 'ارسال نظر' : 'Post comment'} />
            <p className="text-xs text-text-muted font-body">
              {isFa ? 'نظرات پس از تأیید نمایش می‌یابند.' : 'Comments appear after moderation.'}
            </p>
          </div>
        </form>
      ) : (
        <p className="text-sm text-text-muted font-body">
          <Link href="/login" className="text-accent hover:underline">
            {isFa ? 'وارد شوید' : 'Sign in'}
          </Link>{' '}
          {isFa ? 'تا نظر بگذارید.' : 'to leave a comment.'}
        </p>
      )}
    </div>
  );
}
