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
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent"
      data-testid="wordbook-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-[15px] font-semibold">{wordbook.name}</span>
          {subscribed && (
            <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {t.wordbooks.subscribedWordbooks}
            </span>
          )}
        </div>
        <span className="shrink-0 rounded bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {t.wordbooks.wordCount(wordbook.wordCount)}
        </span>
      </div>
      {wordbook.description && (
        <div className="truncate text-[13px] leading-relaxed text-muted-foreground">
          {wordbook.description}
        </div>
      )}
    </Link>
  );
}
