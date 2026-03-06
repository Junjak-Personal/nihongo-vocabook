'use client';

import { useState, useRef, useEffect } from 'react';
import { bind, unbind } from 'wanakana';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Check, Star, Clock, SortAZ } from '@/components/ui/icons';
import { useTranslation } from '@/lib/i18n';
import type { ComponentType } from 'react';

const sortIconMap: Record<string, ComponentType<{ className?: string }>> = {
  priority: Star,
  newest: Clock,
  alphabetical: SortAZ,
  name: SortAZ,
};

interface SortOption {
  value: string;
  label: string;
}

interface ListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchClear: () => void;
  searchPlaceholder: string;
  showReading?: boolean;
  onToggleReading?: () => void;
  showMeaning?: boolean;
  onToggleMeaning?: () => void;
  sortValue?: string;
  sortOptions?: SortOption[];
  onSortChange?: (value: string) => void;
}

export function ListToolbar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  searchPlaceholder,
  showReading,
  onToggleReading,
  showMeaning,
  onToggleMeaning,
  sortValue,
  sortOptions,
  onSortChange,
}: ListToolbarProps) {
  const { t } = useTranslation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = searchRef.current;
    if (!el) return;
    bind(el, { IMEMode: 'toHiragana' });
    return () => unbind(el);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearchSubmit();
  };

  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [sortOpen]);

  return (
    <div className="animate-slide-down-fade sticky top-14 z-[9] bg-background">
      <div className="flex items-center gap-2 px-5 py-2">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-icon -translate-y-1/2 text-text-tertiary" />
          <Input
            ref={searchRef}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={searchPlaceholder}
            className="rounded-md border-none bg-secondary pl-10 pr-8 text-body shadow-none placeholder:text-text-tertiary"
            data-testid="list-toolbar-search-input"
          />
          {searchValue && (
            <button
              type="button"
              onClick={onSearchClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              data-testid="list-toolbar-search-clear"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-end gap-2">
          {onToggleReading && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] leading-none text-text-tertiary">{t.common.hideReading}</span>
              <button
                type="button"
                onClick={onToggleReading}
                className={cn(
                  'flex size-[34px] items-center justify-center rounded-md text-xs font-semibold transition-colors',
                  showReading
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground',
                )}
                data-testid="list-toolbar-toggle-reading"
                aria-label="Toggle reading"
              >
                あ
              </button>
            </div>
          )}
          {onToggleMeaning && (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] leading-none text-text-tertiary">{t.common.hideMeaning}</span>
              <button
                type="button"
                onClick={onToggleMeaning}
                className={cn(
                  'flex size-[34px] items-center justify-center rounded-md text-xs font-semibold transition-colors',
                  showMeaning
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground',
                )}
                data-testid="list-toolbar-toggle-meaning"
                aria-label="Toggle meaning"
              >
                意
              </button>
            </div>
          )}
          {sortOptions && sortValue && onSortChange && (() => {
            const SortIcon = sortIconMap[sortValue] ?? Star;
            return (
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[8px] leading-none text-text-tertiary">{t.common.sort}</span>
                <div className="relative" ref={sortRef}>
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    className="flex size-[34px] items-center justify-center rounded-md bg-secondary text-muted-foreground transition-colors"
                    data-testid="list-toolbar-sort"
                    aria-label="Sort"
                  >
                    <SortIcon className="size-icon" />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-36 rounded-lg border bg-popover py-1 shadow-md">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            onSortChange(opt.value);
                            setSortOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                          data-testid={`list-toolbar-sort-${opt.value}`}
                        >
                          <Check className={`size-4 ${sortValue === opt.value ? 'opacity-100' : 'opacity-0'}`} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
