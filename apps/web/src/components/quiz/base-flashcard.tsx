'use client';

import { useState, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n';
import { bottomSep } from '@/lib/styles';
import type { Word } from '@/types/word';
import type { CardDirection } from '@/types/quiz';

interface BaseFlashcardProps {
  word?: Word;
  progress: { current: number; total: number };
  isLoading?: boolean;
  cardDirection?: CardDirection;
  renderActions: (props: { word: Word; onAdvance: () => void; revealed: boolean }) => ReactNode;
  renderLoadingActions: () => ReactNode;
  testId?: string;
}

/** Resolve 'random' once per card mount */
function useResolvedDirection(direction: CardDirection): 'term_first' | 'meaning_first' {
  const [resolved] = useState<'term_first' | 'meaning_first'>(() =>
    direction === 'random'
      ? (Math.random() < 0.5 ? 'term_first' : 'meaning_first')
      : direction,
  );
  return direction === 'random' ? resolved : direction;
}

export function BaseFlashcard({
  word,
  progress,
  isLoading = false,
  cardDirection = 'term_first',
  renderActions,
  renderLoadingActions,
  testId = 'flashcard',
}: BaseFlashcardProps) {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const dir = useResolvedDirection(cardDirection);

  const pct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="h-[3px] w-full bg-secondary" />
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-4">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-10 w-48 rounded" />
          <Skeleton className="mt-2 h-5 w-32 rounded" />
        </div>
        <div className="shrink-0 px-5 pb-2 pt-3">
          <div className={bottomSep} />
          {renderLoadingActions()}
        </div>
      </div>
    );
  }

  if (!word) {
    return null;
  }

  const isTermFirst = dir === 'term_first';
  const frontText = isTermFirst ? word.term : word.meaning;
  const backPrimary = isTermFirst ? word.meaning : word.term;
  const backReading = isTermFirst ? word.reading : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Progress bar */}
      <div className="h-[3px] w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Tap zone */}
      <div
        className="animate-card-enter relative min-h-0 flex-1 cursor-pointer overflow-y-auto px-4 text-center"
        onClick={() => setRevealed((v) => !v)}
        data-testid={testId}
      >
        {/* Front text — fixed at 35% from top */}
        <div className="absolute inset-x-0 top-[35%] flex flex-col items-center gap-3">
          <div className={isTermFirst ? 'text-display font-medium leading-tight' : 'text-2xl font-medium md:text-3xl'}>
            {frontText}
          </div>

          {/* Reading — shown when revealed */}
          {revealed && backReading ? (
            <div className="animate-fade-in text-reading text-text-secondary">
              {backReading}
            </div>
          ) : null}

          {/* Back content */}
          {revealed ? (
            <>
              <div className={isTermFirst
                ? 'animate-reveal-up text-subtitle font-semibold text-primary dark:text-accent-muted'
                : 'animate-reveal-up text-3xl font-bold text-primary dark:text-accent-muted md:text-4xl'
              }>
                {backPrimary}
              </div>
              {word.notes && (
                <div
                  className="animate-reveal-up text-sm text-muted-foreground"
                  style={{ animationDelay: '100ms' }}
                >
                  {word.notes}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-text-tertiary">
              {t.quiz.tapToReveal}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 px-5 pb-2 pt-3">
        <div className={bottomSep} />
        <div className="flex flex-col gap-3">
          {renderActions({ word, onAdvance: () => setRevealed(false), revealed })}
        </div>
      </div>
    </div>
  );
}
