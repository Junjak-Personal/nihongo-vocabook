'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Word } from '@/types/word';

interface WordCardProps {
  word: Word;
  showReading: boolean;
  showMeaning: boolean;
  /** When provided, renders a clickable div instead of a Link */
  onClick?: () => void;
}

export function WordCard({ word, showReading, showMeaning, onClick }: WordCardProps) {
  const [revealed, setRevealed] = useState(false);

  const readingVisible = showReading || revealed;
  const meaningVisible = showMeaning || revealed;

  const Wrapper = onClick ? 'button' : Link;
  const wrapperProps = onClick
    ? { onClick, type: 'button' as const, className: 'min-w-0 flex-1 text-left', 'data-testid': 'word-card' }
    : { href: `/words/${word.id}`, className: 'min-w-0 flex-1', 'data-testid': 'word-card' };

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-secondary bg-card p-4 transition-colors hover:bg-accent">
      <div className="flex items-center justify-between">
        <Wrapper {...(wrapperProps as any)}>
          <div className="flex items-center gap-2.5">
            {word.priority === 1 && (
              <span className="size-[7px] shrink-0 rounded-full bg-primary" />
            )}
            {word.priority === 2 && (
              <span className="size-[7px] shrink-0 rounded-full bg-primary/50" />
            )}
            {word.priority === 3 && (
              <span className="size-[7px] shrink-0 rounded-full bg-border-strong" />
            )}
            {word.isLeech && (
              <span className="size-[7px] shrink-0 rounded-full bg-orange-500" title="Leech" />
            )}
            <span className="text-lg font-medium">{word.term}</span>
          </div>
        </Wrapper>
        {(!showReading || !showMeaning) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setRevealed((v) => !v);
            }}
            className={cn(
              'shrink-0',
              revealed ? 'text-primary' : 'text-tertiary',
            )}
            data-testid="word-card-reveal"
            aria-label={revealed ? 'Hide details' : 'Reveal details'}
          >
            {revealed ? (
              <EyeOffIcon className="size-[18px]" />
            ) : (
              <EyeIcon className="size-[18px]" />
            )}
          </button>
        )}
      </div>
      <div
        className={cn(
          'overflow-hidden pl-[18px] transition-[max-height,opacity,transform] duration-300 ease-out',
          readingVisible || meaningVisible
            ? 'max-h-16 translate-y-0 opacity-100'
            : 'max-h-0 -translate-y-0.5 opacity-0',
        )}
      >
        <div className="flex flex-col gap-0.5">
          {readingVisible && (
            <div className="text-[13px] text-muted-foreground">{word.reading}</div>
          )}
          {meaningVisible && (
            <div className="text-xs text-muted-foreground">{word.meaning}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}
