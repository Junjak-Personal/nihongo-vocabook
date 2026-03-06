'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';

const STORAGE_CONSENT_KEY = 'vocabook_storage_consent';

function getLocalConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_CONSENT_KEY) === 'true';
}

function setLocalConsent(): void {
  localStorage.setItem(STORAGE_CONSENT_KEY, 'true');
}

export function ConsentGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);

  const isProd = process.env.NODE_ENV === 'production';

  const [consented, setConsented] = useState<boolean | null>(isProd ? null : true);
  const [declined, setDeclined] = useState(false);

  const checkConsent = useCallback(async () => {
    // Skip consent in non-production environments
    if (!isProd) {
      setConsented(true);
      return;
    }

    // Guest: check localStorage
    if (!user) {
      setConsented(getLocalConsent());
      return;
    }

    // Authenticated: check DB
    const supabase = createClient();
    const { data } = await supabase
      .from('user_settings')
      .select('storage_agreed_at')
      .eq('user_id', user.id)
      .single();

    if (data?.storage_agreed_at) {
      setConsented(true);
      return;
    }

    // Auto-migrate localStorage consent → DB
    if (getLocalConsent()) {
      await supabase
        .from('user_settings')
        .update({ storage_agreed_at: new Date().toISOString() })
        .eq('user_id', user.id);
      setConsented(true);
      return;
    }

    setConsented(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    checkConsent();
  }, [authLoading, checkConsent]);

  const handleAgree = async () => {
    setLocalConsent();

    if (user) {
      const supabase = createClient();
      await supabase
        .from('user_settings')
        .update({ storage_agreed_at: new Date().toISOString() })
        .eq('user_id', user.id);
    }

    setConsented(true);
    setDeclined(false);
  };

  // Still loading auth or consent status
  if (authLoading || consented === null) {
    return null;
  }

  // Show consent form
  if (!consented) {
    return (
      <div className="flex flex-1 items-center justify-center bg-secondary px-6">
        <div className="flex w-full flex-col gap-5 rounded-2xl bg-background px-6 py-8 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
          <h2 className="text-xl font-bold">{t.consent.storageTitle}</h2>
          <p className="text-center text-reading leading-[1.5] text-muted-foreground">
            {t.consent.storageDescription}
          </p>

          {declined && (
            <p className="text-sm text-destructive">
              {t.consent.storageDeclinedMessage}
            </p>
          )}

          <div className="flex flex-col gap-[10px]">
            <Button onClick={handleAgree} className="w-full">
              {t.consent.storageAgree}
            </Button>
            <Button
              variant="outline"
              className="w-full text-muted-foreground"
              onClick={() => setDeclined(true)}
            >
              {t.consent.storageDecline}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
