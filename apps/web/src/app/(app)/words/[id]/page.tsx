'use client';

import { useState, useEffect, use, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Trash2, X, LinkIcon, AlertTriangle, ChevronLeft, ChevronRight, Eye } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { WordForm } from '@/components/word/word-form';
import { AddToWordbookDialog } from '@/components/wordbook/add-to-wordbook-dialog';
import { useRepository } from '@/lib/repository/provider';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/lib/i18n';
import { getListCache, invalidateListCache } from '@/lib/list-cache';
import { scrollArea, bottomBar, bottomSep, emptyState, sectionLabel } from '@/lib/styles';
import type { WordSortOrder } from '@/lib/repository/types';
import type { Word, StudyProgress } from '@/types/word';

interface WordsCacheData {
  words: Word[];
  totalCount: number;
  sortOrder: WordSortOrder;
}

export default function WordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const repo = useRepository();
  const authLoading = useAuthStore((s) => s.loading);
  const { t, locale } = useTranslation();
  const [word, setWord] = useState<Word | null>(null);
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [wordbookDialogOpen, setWordbookDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editDirty, setEditDirty] = useState(false);
  const [showLeaveEditConfirm, setShowLeaveEditConfirm] = useState(false);
  const pendingEditLeaveRef = useRef<(() => void) | null>(null);
  const [prevWordId, setPrevWordId] = useState<string | null>(null);
  const [nextWordId, setNextWordId] = useState<string | null>(null);
  const [showWordInfo, setShowWordInfo] = useState(
    () => searchParams.get('showInfo') !== '0',
  );
  const requestLeaveEdit = useCallback((action: () => void) => {
    if (!editDirty) {
      action();
      return;
    }
    pendingEditLeaveRef.current = action;
    setShowLeaveEditConfirm(true);
  }, [editDirty]);

  useEffect(() => {
    if (authLoading) return;
    const wordsCache = getListCache<WordsCacheData>('words');
    const cachedWords = wordsCache?.data.words ?? [];
    const hasCurrentInCache = cachedWords.some((item) => item.id === id);

    const orderedWordsPromise = hasCurrentInCache
      ? Promise.resolve(cachedWords)
      : repo.words.getNonMastered().then((allWords) => {
        const sortOrder = wordsCache?.data.sortOrder ?? 'priority';
        if (sortOrder === 'newest') {
          return [...allWords].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        if (sortOrder === 'alphabetical') {
          return [...allWords].sort((a, b) => a.term.localeCompare(b.term, 'ja'));
        }
        return allWords;
      });

    Promise.all([
      repo.words.getById(id),
      repo.study.getProgress(id),
      orderedWordsPromise,
    ]).then(([w, p, orderedWords]) => {
      const currentIndex = orderedWords.findIndex((item) => item.id === id);
      setPrevWordId(currentIndex > 0 ? orderedWords[currentIndex - 1]?.id ?? null : null);
      setNextWordId(
        currentIndex >= 0 && currentIndex < orderedWords.length - 1
          ? orderedWords[currentIndex + 1]?.id ?? null
          : null,
      );
      setWord(w);
      setProgress(p);
      setLoading(false);
    });
  }, [repo, id, authLoading]);

  useEffect(() => {
    if (!editing || !editDirty) return undefined;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editing, editDirty]);

  useEffect(() => {
    if (!editing || !editDirty) return undefined;
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = (e.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      if (target.target && target.target !== '_self') return;

      e.preventDefault();
      requestLeaveEdit(() => {
        if (/^https?:\/\//.test(href)) {
          window.location.assign(href);
        } else {
          router.push(href);
        }
      });
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [editing, editDirty, requestLeaveEdit, router]);

  const handleConfirmLeaveEdit = () => {
    setShowLeaveEditConfirm(false);
    const next = pendingEditLeaveRef.current;
    pendingEditLeaveRef.current = null;
    setEditDirty(false);
    next?.();
  };

  const handleCancelLeaveEdit = () => {
    setShowLeaveEditConfirm(false);
    pendingEditLeaveRef.current = null;
  };

  const handleUpdate = async (data: Parameters<typeof repo.words.update>[1]) => {
    try {
      await repo.words.update(id, data);
      invalidateListCache('words');
      invalidateListCache('mastered');
      toast.success(t.words.wordUpdated);
      setEditDirty(false);
      setEditing(false);
      const updated = await repo.words.getById(id);
      setWord(updated);
    } catch (err) {
      if (err instanceof Error && err.message === 'DUPLICATE_WORD') {
        toast.error(t.words.duplicateWord);
      } else {
        throw err;
      }
    }
  };

  const handleDelete = async () => {
    setShowDeleteConfirm(false);
    await repo.words.delete(id);
    invalidateListCache('words');
    invalidateListCache('mastered');
    toast.success(t.words.wordDeleted);
    router.push('/words');
  };

  const handleToggleMastered = async () => {
    if (!word) return;
    const updated = await repo.words.setMastered(id, !word.mastered);
    invalidateListCache('words');
    invalidateListCache('mastered');
    invalidateListCache('wordbooks');
    setWord(updated);
  };

  const handleSetPriority = async (priority: number) => {
    await repo.words.update(id, { priority });
    setWord((prev) => prev ? { ...prev, priority } : prev);
  };

  const handleMoveWord = (targetId: string | null) => {
    if (!targetId) return;
    router.push(`/words/${targetId}?showInfo=${showWordInfo ? '1' : '0'}`);
  };

  const formatNextReview = (nextReview: Date) => {
    const now = new Date();
    const diffMs = nextReview.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return t.wordDetail.now;
    if (diffDays === 1) return t.wordDetail.tomorrow;
    return t.wordDetail.days(diffDays);
  };

  if (loading) {
    return (
      <>
        <Header title={t.wordDetail.title} showBack />
        <div className={cn(scrollArea, 'min-h-0 p-4')}>
          <div className="animate-page space-y-5">
            {/* Term + Reading skeleton */}
            <div>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="mt-2 h-5 w-1/4" />
            </div>
            <Separator />
            {/* Meaning skeleton */}
            <div>
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-2 h-7 w-2/3" />
            </div>
            {/* Difficulty + Priority skeleton */}
            <div className="flex gap-6">
              <div className="shrink-0">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-20" />
              </div>
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-12" />
                <div className="mt-2 flex gap-1.5">
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
            {/* Tags skeleton */}
            <div>
              <Skeleton className="h-3 w-10" />
              <div className="mt-2 flex gap-1">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <Separator />
            {/* Study progress + Created date skeleton */}
            <div className="flex gap-6">
              <div className="flex-1">
                <Skeleton className="h-3 w-24" />
                <div className="mt-2 space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <Skeleton className="ml-auto h-3 w-20" />
                <Skeleton className="ml-auto mt-2 h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className={bottomBar}>
          <div className={bottomSep} />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" disabled>{t.wordDetail.addToWordbook}</Button>
            <Button className="flex-1" disabled>{t.wordDetail.markMastered}</Button>
          </div>
        </div>
      </>
    );
  }

  if (!word) {
    return (
      <>
        <Header title={t.wordDetail.title} showBack />
        <div className={emptyState}>
          {t.words.wordNotFound}
        </div>
      </>
    );
  }

  if (editing) {
    return (
      <>
        <Header
          title={t.words.editWord}
          showBack
          onBack={() => requestLeaveEdit(() => setEditing(false))}
          actions={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => requestLeaveEdit(() => setEditing(false))}
              aria-label={t.common.cancel}
            >
              <X className="size-5" />
            </Button>
          }
        />
        <WordForm
          initialValues={word}
          onSubmit={handleUpdate}
          submitLabel={t.common.update}
          onDirtyChange={setEditDirty}
        />
        <ConfirmDialog
          open={showLeaveEditConfirm}
          icon={<AlertTriangle className="text-destructive" />}
          title={t.common.unsavedChangesTitle}
          description={t.common.unsavedChangesDescription}
          confirmLabel={t.common.leave}
          onConfirm={handleConfirmLeaveEdit}
          onCancel={handleCancelLeaveEdit}
        />
      </>
    );
  }

  return (
    <>
      <Header
        title={t.wordDetail.title}
        showBack
        actions={word.isOwned ? (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setEditDirty(false);
                setEditing(true);
              }}
              data-testid="word-edit-button"
              aria-label={t.common.edit}
            >
              <Pencil className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowDeleteConfirm(true)}
              data-testid="word-delete-button"
              aria-label={t.common.delete}
            >
              <Trash2 className="size-5" />
            </Button>
          </div>
        ) : undefined}
      />

      <div className={cn(scrollArea, 'px-5 py-4')}>
        <div className="animate-page flex flex-col gap-6">

          {/* Word block — kanji/reading/meaning card */}
          <div className="relative overflow-hidden rounded-xl bg-secondary" style={{ minHeight: 180 }}>
            {/* Prev/Next navigation arrows */}
            <button
              className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center disabled:opacity-30"
              onClick={() => handleMoveWord(prevWordId)}
              disabled={!prevWordId}
              data-testid="word-prev-button"
              aria-label={t.common.previous}
            >
              <ChevronLeft className="size-5 text-text-tertiary" />
            </button>
            <button
              className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center disabled:opacity-30"
              onClick={() => handleMoveWord(nextWordId)}
              disabled={!nextWordId}
              data-testid="word-next-button"
              aria-label={t.common.next}
            >
              <ChevronRight className="size-5 text-text-tertiary" />
            </button>

            {/* Eye toggle button — top-right inside card */}
            <button
              className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-border"
              onClick={() => setShowWordInfo((prev) => !prev)}
              data-testid="word-toggle-info-button"
              aria-label={`${t.words.showReading} / ${t.words.showMeaning}`}
            >
              <Eye className="size-icon text-text-secondary" />
            </button>

            {/* Center content */}
            <div className="flex flex-col items-center py-6 text-center">
              {/* Reading */}
              <div
                className={cn(
                  'text-reading text-text-secondary transition-[opacity,filter] duration-300 ease-out',
                  showWordInfo ? 'opacity-100 blur-0' : 'opacity-70 blur-[2px]',
                )}
              >
                {showWordInfo ? word.reading : '•••'}
              </div>
              {/* Kanji */}
              <div className="mt-1 text-kanji-lg font-medium leading-tight text-foreground">
                {word.term}
              </div>
              {/* Meaning */}
              <div
                className={cn(
                  'text-section font-medium text-primary transition-[opacity,filter] duration-300 ease-out',
                  showWordInfo ? 'opacity-100 blur-0' : 'opacity-70 blur-[2px]',
                )}
              >
                {showWordInfo ? word.meaning : '•••'}
              </div>

              {/* Status badges */}
              {(word.mastered || word.isLeech || !word.isOwned) && (
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {word.mastered && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {t.nav.mastered}
                    </Badge>
                  )}
                  {word.isLeech && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                      <AlertTriangle className="mr-1 size-3" />
                      {t.wordDetail.leech}
                    </Badge>
                  )}
                  {!word.isOwned && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <LinkIcon className="mr-1 size-3" />
                      {t.wordDetail.subscribedWord}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-secondary" />

          {/* Meta grid — LEVEL / PRIORITY / CREATED */}
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-1">
              <div className={sectionLabel}>{t.wordDetail.difficulty}</div>
              <div className="text-body font-medium">
                {word.jlptLevel ? `JLPT N${word.jlptLevel}` : t.wordDetail.unclassified}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className={sectionLabel}>{t.priority.title}</div>
              <div className="flex gap-1.5">
                {[
                  { value: 1, label: t.priority.high, color: 'bg-primary' },
                  { value: 2, label: t.priority.medium, color: 'bg-accent-muted' },
                  { value: 3, label: t.priority.low, color: 'bg-border-strong' },
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => handleSetPriority(p.value)}
                    className={cn(
                      'flex items-center gap-1 rounded-full border px-2 py-0.5 text-badge font-medium transition-colors',
                      word.priority === p.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-text-secondary hover:bg-accent',
                    )}
                  >
                    <span className={cn('size-1.5 rounded-full', p.color)} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className={sectionLabel}>{t.common.createdAt}</div>
              <div className="text-reading font-semibold">
                {word.createdAt.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-secondary" />

          {/* Study Progress */}
          <div className="flex flex-col gap-3">
            <div className={sectionLabel}>{t.wordDetail.studyProgress}</div>
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-secondary p-3">
                <div className={sectionLabel}>{t.wordDetail.reviews}</div>
                <div className="text-body font-medium">{progress?.reviewCount ?? 0}</div>
              </div>
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-secondary p-3">
                <div className={sectionLabel}>{t.wordDetail.nextReview}</div>
                <div className="text-body font-medium">
                  {progress ? formatNextReview(progress.nextReview) : t.wordDetail.notStarted}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-secondary" />

          {/* Tags */}
          {word.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className={sectionLabel}>{t.wordDetail.tags}</div>
              <div className="flex flex-wrap gap-2">
                {word.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-3 py-2 text-caption font-medium text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {word.notes && (
            <div className="flex flex-col gap-2">
              <div className={sectionLabel}>{t.wordDetail.notes}</div>
              <div className="rounded-lg bg-secondary p-3 text-body">{word.notes}</div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons — fixed outside scroll */}
      <div className={bottomBar}>
        <div className={bottomSep} />
        <div className="flex gap-3">
          {!word.mastered && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setWordbookDialogOpen(true)}
              data-testid="word-add-to-wordbook-button"
            >
              {t.wordDetail.addToWordbook}
            </Button>
          )}

          <Button
            className="flex-1"
            onClick={handleToggleMastered}
            data-testid="word-mastered-button"
          >
            {word.mastered ? t.wordDetail.unmarkMastered : t.wordDetail.markMastered}
          </Button>
        </div>
      </div>

      <AddToWordbookDialog
        wordId={id}
        open={wordbookDialogOpen}
        onClose={() => setWordbookDialogOpen(false)}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        icon={<Trash2 className="text-destructive" />}
        title={t.common.delete}
        description={t.words.deleteConfirm}
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
