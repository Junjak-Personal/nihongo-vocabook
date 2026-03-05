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
    <div className="flex flex-col gap-[6px] rounded-xl border border-secondary bg-card p-4 transition-colors hover:bg-accent">
      <div className="flex items-center justify-between gap-2">
        <Wrapper {...(wrapperProps as any)}>
          <div className="flex items-center gap-[10px]">
            <span className="text-section font-medium leading-tight">{word.term}</span>
          </div>
        </Wrapper>
        <div className="flex shrink-0 items-center gap-2">
          {word.jlptLevel !== null && word.jlptLevel > 0 && (
            <span className="rounded bg-secondary px-1.5 py-0.5 text-badge font-medium text-muted-foreground">
              N{word.jlptLevel}
            </span>
          )}
          {word.priority === 1 && (
            <span className="size-2 shrink-0 rounded-full bg-[#F59E0B]" />
          )}
          {word.priority === 2 && (
            <span className="size-2 shrink-0 rounded-full bg-[#F59E0B]/50" />
          )}
          {word.isLeech && (
            <span className="size-2 shrink-0 rounded-full bg-orange-500" title="Leech" />
          )}
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
                <EyeOffIcon className="size-icon" />
              ) : (
                <EyeIcon className="size-icon" />
              )}
            </button>
          )}
        </div>
      </div>
      <div
        className={cn(
          'overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out',
          readingVisible || meaningVisible
            ? 'max-h-16 translate-y-0 opacity-100'
            : 'max-h-0 -translate-y-0.5 opacity-0',
        )}
      >
        <div className="flex flex-col gap-0.5 pl-0">
          {readingVisible && (
            <div className="text-caption text-muted-foreground">{word.reading}</div>
          )}
          {meaningVisible && (
            <div className="text-badge text-muted-foreground">{word.meaning}</div>
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
