'use client';

import Link from 'next/link';
import { BookOpen, Brain, Camera, Share2 } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
// styles not needed for landing — inline

export default function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { icon: BookOpen, text: t.landing.feature1 },
    { icon: Brain, text: t.landing.feature2 },
    { icon: Camera, text: t.landing.feature4 },
    { icon: Share2, text: t.landing.feature3 },
  ];

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-8">
      {/* Hero */}
      <div className="h-20 shrink-0" />
      <div className="animate-fade-in text-center">
        <div className="text-5xl font-bold tracking-[-1.5px] text-primary">
          NiVoca
        </div>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {t.landing.subtitle}
        </p>
      </div>

      <div className="h-12 shrink-0" />

      {/* Features */}
      <div className="w-full space-y-0">
        {features.map((feature, i) => (
          <div
            key={i}
            className="animate-stagger flex items-center gap-4 py-4 text-sm leading-relaxed text-muted-foreground"
            style={{ '--stagger': i + 3 } as React.CSSProperties}
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
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
            <Button className="h-[52px] w-full rounded-[14px] text-base font-semibold" data-testid="landing-start-button">
              {t.landing.startLearning}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="h-11 w-full rounded-[14px] text-[15px] font-medium text-muted-foreground">
              {t.landing.signIn}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
