'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import type { WordbookWithCount } from '@/types/wordbook';

interface WordbookCardProps {
  wordbook: WordbookWithCount;
  subscribed?: boolean;
}

export function WordbookCard({ wordbook, subscribed }: WordbookCardProps) {
  const { t } = useTranslation();

  const total = wordbook.wordCount;
  const mastered = wordbook.masteredCount ?? 0;
  const progressPct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <Link
      href={`/wordbooks/${wordbook.id}`}
      className="flex flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-card p-4 transition-colors hover:bg-accent"
      data-testid="wordbook-card"
    >
      {/* Top row: title + count badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-title-sm font-semibold">{wordbook.name}</span>
          {subscribed && (
            <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-overline font-medium text-primary">
              {t.wordbooks.subscribedWordbooks}
            </span>
          )}
        </div>
        <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-badge font-medium text-muted-foreground">
          {t.wordbooks.wordCount(wordbook.wordCount)}
        </span>
      </div>

      {/* Description */}
      {wordbook.description && (
        <div className="line-clamp-2 text-caption leading-[1.4] text-muted-foreground">
          {wordbook.description}
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-sm bg-secondary">
          <div
            className="h-full rounded-sm bg-primary"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="text-badge font-semibold text-primary">{progressPct}%</span>
      </div>
    </Link>
  );
}
