'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/lib/i18n';
import { bottomBar, bottomSep } from '@/lib/styles';
import {
  getLocalOcrMode,
  setLocalOcrMode,
  fetchOcrSettings,
  saveOcrSettings,
  type OcrMode,
  type LlmProvider,
} from '@/lib/ocr/settings';

const PROVIDERS: { value: LlmProvider; label: string }[] = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Gemini' },
];

export default function OcrSettingsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<OcrMode>('ocr');
  const [provider, setProvider] = useState<LlmProvider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMode(getLocalOcrMode());

    if (!user) {
      setLoading(false);
      return;
    }

    fetchOcrSettings()
      .then((settings) => {
        setProvider(settings.llmProvider);
        setApiKey(settings.apiKey);
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      setLocalOcrMode(mode);
      if ((mode === 'llm' || mode === 'hybrid') && user) {
        await saveOcrSettings({ llmProvider: provider, apiKey: apiKey || undefined });
      }
      toast.success(t.profile.saved);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header title={t.settings.ocrSettings} showBack />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="animate-page flex-1 space-y-6 overflow-y-auto px-5 pt-3">
          {/* Mode selector */}
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              {t.settings.ocrMode}
            </h2>
            <div className="flex gap-2">
              {([
                { value: 'ocr' as const, label: t.settings.ocrFree },
                { value: 'llm' as const, label: t.settings.llmVision },
                { value: 'hybrid' as const, label: t.settings.llmHybrid },
              ]).map((opt) => (
                <Button
                  key={opt.value}
                  variant={mode === opt.value ? 'default' : 'outline'}
                  size="sm"
                  className={cn('!h-9 rounded-md', mode !== opt.value && 'text-muted-foreground')}
                  onClick={() => setMode(opt.value)}
                  data-testid={`ocr-mode-${opt.value}`}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </section>

          {(mode === 'llm' || mode === 'hybrid') && user && !loading && (
            <>
              <Separator />

              {/* Provider selector */}
              <section className="space-y-2">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {t.settings.llmProvider}
                </h2>
                <div className="flex gap-2">
                  {PROVIDERS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={provider === opt.value ? 'default' : 'outline'}
                      size="sm"
                      className={cn('!h-9 rounded-md', provider !== opt.value && 'text-muted-foreground')}
                      onClick={() => setProvider(opt.value)}
                      data-testid={`ocr-provider-${opt.value}`}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </section>

              <Separator />

              {/* API key */}
              <section className="space-y-2">
                <Label htmlFor="api-key">{t.settings.apiKey}</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t.settings.apiKeyPlaceholder}
                  data-testid="ocr-api-key-input"
                />
              </section>
            </>
          )}
        </div>

        <div className={bottomBar}>
          <div className={bottomSep} />
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={saving}
            data-testid="ocr-save-button"
          >
            {saving ? t.common.saving : t.common.save}
          </Button>
        </div>
      </div>
    </>
  );
}
