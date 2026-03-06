'use client';

import Link from 'next/link';
import { BookOpen, Brain, Camera, Share2 } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { btnCta } from '@/lib/styles';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, text: t.landing.feature1 },
    { icon: Brain, text: t.landing.feature2 },
    { icon: Camera, text: t.landing.feature4 },
    { icon: Share2, text: t.landing.feature3 },
  ];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden px-8">
      {/* Top spacer */}
      <div className="h-20 shrink-0" />

      {/* Hero */}
      <div className="animate-fade-in flex w-full flex-col items-center gap-3 text-center">
        <div className="font-ja text-display font-bold leading-none tracking-[-1.5px] text-primary">
          NiVoca
        </div>
        <p className="w-[260px] whitespace-pre-line text-title-sm leading-[1.5] text-muted-foreground">
          {t.landing.subtitle}
        </p>
      </div>

      <div className="h-12 shrink-0" />

      {/* Features */}
      <div className="w-[300px]">
        {features.map((feature, i) => (
          <div
            key={i}
            className="animate-stagger flex items-center gap-4 py-4 text-reading leading-[1.5] text-muted-foreground"
            style={{ '--stagger': i + 3 } as React.CSSProperties}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary dark:bg-card">
              <feature.icon className="size-5 text-primary" />
            </div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />

      {/* CTA */}
      <div className="animate-slide-up w-full shrink-0 pb-12" style={{ animationDelay: '200ms' }}>
        <div className="flex flex-col gap-3">
          <Link href="/words">
            <Button className={cn(btnCta, 'text-primary-foreground')} data-testid="landing-start-button">
              {t.landing.startLearning}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className={cn(btnCta, 'font-medium text-muted-foreground')}>
              {t.landing.signIn}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
