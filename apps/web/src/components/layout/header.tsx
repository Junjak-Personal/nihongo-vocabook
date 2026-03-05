'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useNavigationLockStore } from '@/stores/navigation-lock-store';

interface HeaderProps {
  title: string;
  desc?: string;
  actions?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  allowBackWhenLocked?: boolean;
}

export function Header({
  title,
  desc,
  actions,
  showBack,
  onBack,
  allowBackWhenLocked = false,
}: HeaderProps) {
  const router = useRouter();
  const navLocked = useNavigationLockStore((s) => s.lockCount > 0);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-background px-5">
      <div className="flex items-center gap-2">
        {(showBack || onBack) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack ?? (() => router.back())}
            disabled={navLocked && !allowBackWhenLocked}
            aria-label="Go back"
            className="-ml-2"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
        {desc && (
          <span className="self-end pb-0.5 text-xs text-muted-foreground">{desc}</span>
        )}
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </header>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
    >
      <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
    </svg>
  );
}
