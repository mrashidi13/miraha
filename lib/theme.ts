export interface Theme {
  colorPrimary: string;       // sky blue — headings, borders, section accents
  colorPrimaryLight: string;  // pale sky wash — alternating section backgrounds
  colorAccent: string;        // oasis green — buttons and interactive only
  colorAccentHover: string;   // darker green — hover/active state for buttons
  colorBg: string;            // page background
  colorText: string;          // body text
  colorTextMuted: string;     // secondary / caption text
  fontHeading: string;        // CSS font-family value for headings
  fontBody: string;           // CSS font-family value for body / Persian text
}

export const defaultTheme: Theme = {
  colorPrimary: '#5ba3c9',
  colorPrimaryLight: '#e8f4f9',
  colorAccent: '#4d9b72',
  colorAccentHover: '#3c7c5a',
  colorBg: '#ffffff',
  colorText: '#1c3040',
  colorTextMuted: '#4a6a7a',
  fontHeading: 'var(--font-fraunces), Georgia, serif',
  fontBody: 'var(--font-vazirmatn), system-ui, sans-serif',
};

export function buildThemeCssVars(theme: Theme): string {
  return [
    `--color-primary: ${theme.colorPrimary}`,
    `--color-primary-light: ${theme.colorPrimaryLight}`,
    `--color-accent: ${theme.colorAccent}`,
    `--color-accent-hover: ${theme.colorAccentHover}`,
    `--color-bg: ${theme.colorBg}`,
    `--color-text: ${theme.colorText}`,
    `--color-text-muted: ${theme.colorTextMuted}`,
    `--font-heading: ${theme.fontHeading}`,
    `--font-body: ${theme.fontBody}`,
  ].join('; ');
}
