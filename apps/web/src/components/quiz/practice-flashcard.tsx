'use client';

import { Button } from '@/components/ui/button';
import { Crown } from '@/components/ui/icons';
import { useTranslation } from '@/lib/i18n';
import { BaseFlashcard } from './base-flashcard';
import type { Word } from '@/types/word';
import type { CardDirection } from '@/types/quiz';

interface PracticeFlashcardProps {
  word?: Word;
  onRecall: (wordId: string, known: boolean) => void;
  onMaster: (wordId: string) => void;
  progress: { current: number; total: number };
  isLoading?: boolean;
  cardDirection?: CardDirection;
}

export function PracticeFlashcard({ word, onRecall, onMaster, progress, isLoading = false, cardDirection }: PracticeFlashcardProps) {
  const { t } = useTranslation();

  return (
    <BaseFlashcard
      word={word}
      progress={progress}
      isLoading={isLoading}
      cardDirection={cardDirection}
      testId="practice-flashcard"
      renderLoadingActions={() => (
        <>
          <div className="flex gap-2">
            <Button variant="outline" disabled className="h-12 flex-1 rounded-lg text-sm font-medium text-tertiary">{t.quiz.didntKnow}</Button>
            <Button disabled className="h-12 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{t.quiz.knewIt}</Button>
          </div>
          <Button variant="outline" disabled className="h-12 w-full rounded-lg text-sm">
            <Crown className="size-4" />
            {t.wordDetail.markMastered}
          </Button>
        </>
      )}
      renderActions={({ word: w, onAdvance }) => (
        <>
          <div className="flex gap-2" data-testid="practice-recall">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-lg text-sm font-medium text-tertiary hover:bg-secondary/50"
              onClick={() => { onRecall(w.id, false); onAdvance(); }}
              data-testid="practice-recall-no"
            >
              {t.quiz.didntKnow}
            </Button>
            <Button
              className="h-12 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={() => { onRecall(w.id, true); onAdvance(); }}
              data-testid="practice-recall-yes"
            >
              {t.quiz.knewIt}
            </Button>
          </div>
          <Button
            variant="outline"
            className="h-12 w-full rounded-lg text-sm"
            onClick={() => onMaster(w.id)}
            data-testid="practice-master"
          >
            <Crown className="size-4" />
            {t.wordDetail.markMastered}
          </Button>
        </>
      )}
    />
  );
}
