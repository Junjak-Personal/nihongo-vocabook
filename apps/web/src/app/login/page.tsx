'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n';

const REMEMBERED_EMAIL_KEY = 'vocabook_remembered_email';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (rememberEmail) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push('/words');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Branding */}
      <div className="shrink-0 px-8 pb-6 pt-[137px]">
        <div className="text-4xl font-bold tracking-tight text-primary" style={{ letterSpacing: '-1px' }}>NiVoca</div>
        <p className="mt-2 text-[15px] text-muted-foreground">{t.landing.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              data-testid="login-email-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.password}
              required
              data-testid="login-password-input"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="size-[18px] rounded border-border-strong accent-primary"
                data-testid="login-remember-email"
              />
              {t.auth.rememberEmail}
            </label>
            <Link href="/words" className="text-sm text-primary underline">
              {t.auth.continueAsGuest}
            </Link>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="shrink-0 space-y-3 px-6 pb-8 pt-8">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="login-submit-button"
          >
            {loading ? t.auth.signingIn : t.auth.signIn}
          </Button>
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">{t.auth.noAccount}</span>
            <Link href="/signup" className="font-semibold text-primary" data-testid="login-goto-signup">
              {t.auth.signUp}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
