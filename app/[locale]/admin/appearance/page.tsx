import { getTheme } from '@/lib/db/settings';
import { actionUpdateTheme } from '@/app/actions/settings';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

interface ColorRowProps { label: string; name: string; defaultValue: string; hint: string }
function ColorRow({ label, name, defaultValue, hint }: ColorRowProps) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" name={name} defaultValue={defaultValue} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
      <div className="flex-1">
        <label htmlFor={name} className="text-xs text-text-muted font-body font-medium uppercase tracking-wider block mb-0.5">{label}</label>
        <p className="text-xs text-text-muted font-body">{hint}</p>
      </div>
      <InputField label="" name={`${name}_hex`} defaultValue={defaultValue} className="w-28 font-mono text-xs" />
    </div>
  );
}

export default async function AppearancePage() {
  const theme = await getTheme();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-2">Appearance</h1>
      <p className="text-sm text-text-muted font-body mb-8">
        Changes apply site-wide instantly. Use the color picker or type a hex value.
        <br />
        <strong>Accent (oasis green)</strong> is for buttons only — not backgrounds or text.
      </p>

      <form action={actionUpdateTheme} className="space-y-6 bg-bg border border-primary/20 rounded-2xl p-6">
        <div className="space-y-4">
          <h2 className="font-heading text-base font-semibold text-primary">Colors</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input type="color" name="colorPrimary" defaultValue={theme.colorPrimary} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Primary (sky blue)</p>
                <p className="text-xs text-text-muted font-body">Headings, borders, section accents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorPrimaryLight" defaultValue={theme.colorPrimaryLight} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Primary wash</p>
                <p className="text-xs text-text-muted font-body">Alternating section backgrounds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorAccent" defaultValue={theme.colorAccent} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Accent (oasis green)</p>
                <p className="text-xs text-text-muted font-body">Buttons and interactive elements only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorAccentHover" defaultValue={theme.colorAccentHover} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Accent hover</p>
                <p className="text-xs text-text-muted font-body">Button hover / active state</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorBg" defaultValue={theme.colorBg} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Background</p>
                <p className="text-xs text-text-muted font-body">Page and card backgrounds</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorText" defaultValue={theme.colorText} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Body text</p>
                <p className="text-xs text-text-muted font-body">Main readable text</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="color" name="colorTextMuted" defaultValue={theme.colorTextMuted} className="w-10 h-10 rounded cursor-pointer border border-primary/20" />
              <div>
                <p className="text-xs font-body font-medium text-text-muted uppercase tracking-wider">Muted text</p>
                <p className="text-xs text-text-muted font-body">Captions, labels, secondary info</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div className="space-y-4 pt-4 border-t border-primary/10">
          <h2 className="font-heading text-base font-semibold text-primary">Fonts</h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted font-body font-medium uppercase tracking-wider block mb-2">
                Heading Font (EN titles, section headers)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'var(--font-fraunces), Georgia, serif', label: 'Fraunces', preview: 'Elegant Heritage' },
                  { value: 'var(--font-playfair), Georgia, serif', label: 'Playfair Display', preview: 'Classic Editorial' },
                  { value: "Georgia, 'Times New Roman', serif", label: 'Georgia', preview: 'Classic Serif' },
                  { value: 'system-ui, -apple-system, sans-serif', label: 'System Sans', preview: 'Modern Clean' },
                ].map(({ value, label, preview }) => (
                  <label
                    key={value}
                    className="flex items-start gap-2 p-3 rounded-xl border border-primary/20 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light transition-colors"
                  >
                    <input
                      type="radio"
                      name="fontHeading"
                      value={value}
                      defaultChecked={theme.fontHeading === value}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-body text-text font-medium">{label}</p>
                      <p className="text-xs text-text-muted font-body">{preview}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-body font-medium uppercase tracking-wider block mb-2">
                Body Font (FA + EN body text, UI)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'var(--font-vazirmatn), system-ui, sans-serif', label: 'Vazirmatn', preview: 'Modern Persian (default)' },
                  { value: "'Tahoma', Vazir, Arial, sans-serif", label: 'Tahoma', preview: 'Traditional Persian' },
                  { value: 'system-ui, -apple-system, sans-serif', label: 'System', preview: 'OS default' },
                ].map(({ value, label, preview }) => (
                  <label
                    key={value}
                    className="flex items-start gap-2 p-3 rounded-xl border border-primary/20 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary-light transition-colors"
                  >
                    <input
                      type="radio"
                      name="fontBody"
                      value={value}
                      defaultChecked={theme.fontBody === value}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <p className="text-sm font-body text-text font-medium">{label}</p>
                      <p className="text-xs text-text-muted font-body">{preview}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SubmitButton label="Apply Theme" />
      </form>
    </div>
  );
}
