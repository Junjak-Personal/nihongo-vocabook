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

  return (
    <Link
      href={`/wordbooks/${wordbook.id}`}
      className="flex flex-col gap-3 rounded-lg border border-secondary bg-card p-4 transition-colors hover:bg-accent"
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

      {/* Tags */}
      <div className="flex min-w-0 gap-1.5 overflow-hidden">
        {wordbook.tags && wordbook.tags.length > 0 ? (
          wordbook.tags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-text-tertiary">{t.wordDetail.noTags}</span>
        )}
      </div>
    </Link>
  );
}
