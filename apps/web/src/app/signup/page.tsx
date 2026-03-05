'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n';

const JLPT_LEVELS = [5, 4, 3, 2, 1] as const;

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [jlptLevel, setJlptLevel] = useState(3);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-check if user agreed on the privacy page
  useEffect(() => {
    const agreed = sessionStorage.getItem('vocabook_privacy_agreed');
    if (agreed === 'true') {
      setPrivacyAgreed(true);
      sessionStorage.removeItem('vocabook_privacy_agreed');
    }
  }, []);

  const passwordHasLetter = /[a-zA-Z]/.test(password);
  const passwordHasNumber = /\d/.test(password);
  const passwordValid = password.length >= 8 && passwordHasLetter && passwordHasNumber;
  const passwordTouched = password.length > 0;
  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;
  const canSubmit =
    email.trim() &&
    passwordValid &&
    passwordConfirm.length > 0 &&
    !passwordMismatch &&
    privacyAgreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { jlpt_level: jlptLevel, privacy_agreed: true },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Branding */}
      <div className="shrink-0 px-8 pb-6 pt-16">
        <div className="text-4xl font-bold tracking-tight text-primary" style={{ letterSpacing: '-1px' }}>NiVoca</div>
        <p className="mt-2 text-[15px] text-muted-foreground">{t.landing.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-3.5 overflow-y-auto px-6 pt-2">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  data-testid="signup-email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.minPassword}
                  minLength={8}
                  required
                  data-testid="signup-password-input"
                />
                <p className={`text-sm ${passwordTouched && !passwordValid ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {t.auth.passwordRule}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-confirm">{t.auth.passwordConfirm}</Label>
                <Input
                  id="password-confirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder={t.auth.passwordConfirm}
                  required
                  data-testid="signup-password-confirm-input"
                />
                {passwordMismatch && (
                  <p className="text-sm text-destructive">
                    {t.auth.passwordMismatch}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.auth.jlptLevel}</Label>
                <div className="flex gap-2">
                  {JLPT_LEVELS.map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={jlptLevel === level ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1"
                      onClick={() => setJlptLevel(level)}
                      data-testid={`signup-jlpt-n${level}`}
                    >
                      N{level}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Privacy consent */}
              <div className="pt-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 size-4 shrink-0 accent-primary"
                    data-testid="signup-privacy-checkbox"
                  />
                  <Link
                    href="/privacy?from=signup"
                    className="text-sm text-primary underline underline-offset-2"
                  >
                    {t.auth.privacyAgree}
                  </Link>
                </div>
              </div>
        </div>

        {/* Bottom buttons */}
        <div className="shrink-0 space-y-3 px-6 pb-8 pt-8">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !canSubmit}
            data-testid="signup-submit-button"
          >
            {loading ? t.auth.creatingAccount : t.auth.createAccount}
          </Button>
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-muted-foreground">{t.auth.hasAccount}</span>
            <Link href="/login" className="font-semibold text-primary" data-testid="signup-goto-login">
              {t.auth.signIn}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
