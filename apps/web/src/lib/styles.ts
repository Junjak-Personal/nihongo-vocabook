/**
 * Centralized style constants derived from .pen design system.
 *
 * Use with `cn()` from `@/lib/utils` when overrides are needed:
 *   cn(styles.scrollArea, 'p-4')
 *
 * Import individual constants or the whole namespace:
 *   import { textBody, cardBase } from '@/lib/styles';
 *   import { styles } from '@/lib/styles';
 */

// ─── Typography ─────────────────────────────────────────
// Composites: font-size token + weight + tracking (no color — add separately)

/** 48px / 700 / -1.5 tracking — hero branding */
export const textDisplay = 'text-display font-bold leading-none tracking-[-1.5px]';

/** 42px / 500 — word detail large kanji (font-ja) */
export const textKanjiLg = 'font-ja text-kanji-lg font-medium leading-tight';

/** 36px / 500 — kanji display (font-ja) */
export const textKanji = 'font-ja text-kanji font-medium';

/** 28px / 700 / -0.5 tracking — main page headers */
export const textPageTitle = 'text-page-title font-bold tracking-[-0.5px]';

/** 20px / 600 — quiz revealed meaning */
export const textSubtitle = 'text-subtitle font-semibold';

/** 18px / 600 — section headers, sub-page titles */
export const textSection = 'text-section font-semibold';

/** 16px / 600 — card titles, CTA buttons */
export const textTitleSm = 'text-title-sm font-semibold';

/** 15px / 400 — default body text */
export const textBody = 'text-body font-normal';

/** 14px / 400 — furigana reading */
export const textReading = 'text-reading font-normal';

/** 13px / 500 — captions, labels, meta info */
export const textCaption = 'text-caption font-medium';

/** 12px / 500 — badges, metrics, counts */
export const textBadge = 'text-badge font-medium';

/** 11px / 600 / +2 tracking / uppercase — overline labels */
export const textOverline = 'text-overline font-semibold uppercase tracking-[2px]';

/** 10px — tab badges, small counters */
export const textMicro = 'text-micro';

/** 9px / 600 — bottom nav tab label */
export const textNav = 'text-nav font-semibold uppercase tracking-[0.5px]';

// ─── Layout ─────────────────────────────────────────────
/** Flex column wrapper that fills remaining space. Wrap pages that have a bottom bar. */
export const pageWrapper = 'flex min-h-0 flex-1 flex-col';

/** Scrollable content area that fills remaining height. */
export const scrollArea = 'flex-1 overflow-y-auto';

// ─── Bottom Action Bar ──────────────────────────────────
/** Fixed bottom bar container (outside scroll area). Design: padding [12,20,8,20]. */
export const bottomBar = 'shrink-0 bg-background px-5 pb-2 pt-3';

/** Separator line inside the bottom bar, placed above buttons. */
export const bottomSep = 'mb-3 h-px bg-border';

// ─── List Rendering ─────────────────────────────────────
/** Standard card list container with uniform spacing. */
export const listContainer = 'space-y-2 px-4 pt-2 pb-4';

/** Vertical gap between list items (no padding). */
export const listGap = 'space-y-2';

// ─── Tabs Area ──────────────────────────────────────────
/** Wrapper around TabsList (shrink-0 with horizontal padding). */
export const tabsBar = 'shrink-0 px-4 pt-2';

/** Horizontal separator below tabs / toolbar. */
export const inlineSep = 'mx-4 h-px bg-border';

/** Search + sort toolbar row. */
export const toolbarRow = 'flex items-center gap-2 px-5 py-2';

// ─── Skeleton Loading ───────────────────────────────────
/** Skeleton list container for word-height items (60px). */
export const skeletonWordList = 'animate-page flex-1 space-y-2 overflow-y-auto px-4 pt-2';

/** Skeleton list container for card-height items (88px). */
export const skeletonCardList = 'animate-page flex-1 space-y-2 overflow-y-auto p-4';

// ─── Empty State ────────────────────────────────────────
/** Full-height centered empty state wrapper. */
export const emptyState =
  'animate-fade-in flex flex-1 flex-col items-center justify-center px-6 text-center text-muted-foreground';

/** Decorative icon inside empty state. */
export const emptyIcon = 'mb-3 size-10 text-muted-foreground/50';

// ─── Section Label ──────────────────────────────────────
/** Uppercase section label used in detail & settings pages. Uses textOverline + color. */
export const sectionLabel = `${textOverline} text-text-tertiary`;

// ─── Cards ──────────────────────────────────────────────
/** Base card container — radius-12 (rounded-lg), border, bg-card. */
export const cardBase = 'rounded-lg border border-border bg-card';

// ─── Buttons (design: h48 r8 font-body/600) ────────────
/** Standard button height + radius. Apply on top of shadcn Button. */
export const btnLg = 'h-12 rounded-md';

/** Landing CTA button — h48, r14, title-sm/600. */
export const btnCta = 'h-12 w-full rounded-cta text-title-sm font-semibold';

/** Icon button — 40x40, radius-8. */
export const btnIcon = 'size-10 rounded-md';

// ─── Inputs (design: h48 r8 border) ────────────────────
/** Standard input height + radius. */
export const inputBase = 'h-12 rounded-md';

/** Search bar — h44, r8, bg-secondary. */
export const inputSearch = 'h-11 rounded-md bg-secondary';

// ─── Settings Page ──────────────────────────────────────
/** Settings page scroll area with section spacing. */
export const settingsScroll = 'animate-page flex-1 space-y-6 overflow-y-auto px-5 py-3';

/** Settings section container. */
export const settingsSection = 'space-y-3';

/** Settings section heading — uses textOverline + color. */
export const settingsHeading = `${textOverline} text-text-tertiary`;

/** Settings navigation link row (design: rounded-12, bg-secondary, p-16, gap-12). */
export const settingsNavLink =
  'flex items-center justify-between rounded-lg bg-secondary p-4 active:bg-accent/50';

/** Settings flat list row (design: h-52, px-4, border-b, icon+label+chevron). */
export const settingsRow =
  'flex h-[52px] items-center justify-between px-4 border-b border-bg-tertiary last:border-b-0';

// ─── Namespace export ───────────────────────────────────
export const styles = {
  // Typography
  textDisplay,
  textKanjiLg,
  textKanji,
  textPageTitle,
  textSubtitle,
  textSection,
  textTitleSm,
  textBody,
  textReading,
  textCaption,
  textBadge,
  textOverline,
  textMicro,
  textNav,
  // Layout
  pageWrapper,
  scrollArea,
  bottomBar,
  bottomSep,
  listContainer,
  listGap,
  tabsBar,
  inlineSep,
  toolbarRow,
  skeletonWordList,
  skeletonCardList,
  emptyState,
  emptyIcon,
  sectionLabel,
  // Cards & components
  cardBase,
  btnLg,
  btnCta,
  btnIcon,
  inputBase,
  inputSearch,
  // Settings
  settingsScroll,
  settingsSection,
  settingsHeading,
  settingsNavLink,
  settingsRow,
} as const;
