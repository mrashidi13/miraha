import { getMap, getAbout } from '@/lib/db/settings';
import { actionUpdateMap, actionUpdateAbout } from '@/app/actions/settings';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function AdminSettingsPage() {
  const [map, about] = await Promise.all([getMap(), getAbout()]);
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full space-y-8">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-2 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary">Site Settings</h1>

      {/* About */}
      <section className="bg-bg border border-primary/20 rounded-2xl p-6">
        <h2 className="font-heading text-lg font-semibold text-primary mb-4">About the Village</h2>
        <form action={actionUpdateAbout} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextareaField label="About text (English)" name="bodyEn" defaultValue={about.bodyEn} rows={6} />
            <TextareaField label="About text (Persian / فارسی)" name="bodyFa" defaultValue={about.bodyFa} rows={6} />
          </div>
          <SubmitButton label="Save About" />
        </form>
      </section>

      {/* Map */}
      <section className="bg-bg border border-primary/20 rounded-2xl p-6">
        <h2 className="font-heading text-lg font-semibold text-primary mb-4">Map & Directions</h2>
        <form action={actionUpdateMap} className="space-y-4">
          <InputField label="Google Maps embed URL" name="embedUrl" defaultValue={map.embedUrl} placeholder="https://www.google.com/maps/embed?pb=…" />
          <div className="grid sm:grid-cols-2 gap-4">
            <TextareaField label="Directions (English)" name="directionsTextEn" defaultValue={map.directionsTextEn} rows={4} />
            <TextareaField label="Directions (Persian / فارسی)" name="directionsTextFa" defaultValue={map.directionsTextFa} rows={4} />
          </div>
          <SubmitButton label="Save Map" />
        </form>
      </section>
    </div>
  );
}
