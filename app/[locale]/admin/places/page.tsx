import { getPlaces } from '@/lib/db/places';
import { actionCreatePlace, actionUpdatePlace, actionDeletePlace } from '@/app/actions/places';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';
import type { Place } from '@prisma/client';

function TextField({ label, name, defaultValue = '', dir }: { label: string; name: string; defaultValue?: string; dir?: string }) {
  return (
    <div>
      <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">{label}</label>
      <input name={name} defaultValue={defaultValue} dir={dir} className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}

function TextArea({ label, name, defaultValue = '', dir }: { label: string; name: string; defaultValue?: string; dir?: string }) {
  return (
    <div>
      <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">{label}</label>
      <textarea name={name} rows={3} defaultValue={defaultValue} dir={dir} className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary resize-none" />
    </div>
  );
}

function PlaceForm({ place, action }: { place?: Place; action: (f: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-4">
      {place && <input type="hidden" name="id" value={place.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Name (EN)" name="nameEn" defaultValue={place?.nameEn} />
        <TextField label="نام (FA)" name="nameFa" defaultValue={place?.nameFa} dir="rtl" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <TextArea label="Description (EN)" name="descriptionEn" defaultValue={place?.descriptionEn} />
        <TextArea label="توضیح (FA)" name="descriptionFa" defaultValue={place?.descriptionFa} dir="rtl" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField label="Latitude (e.g. 33.4)" name="lat" defaultValue={place?.lat?.toString() ?? ''} />
        <TextField label="Longitude (e.g. 55.2)" name="lng" defaultValue={place?.lng?.toString() ?? ''} />
      </div>
      <div>
        <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-2">Images (one URL per line)</label>
        <ImageUpload name="imageUrls" label="Upload image" />
        <textarea
          name="imageUrls"
          rows={3}
          defaultValue={place?.imageUrls.join('\n') ?? ''}
          placeholder="https://..."
          className="w-full mt-2 px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-xs focus:outline-none focus:border-primary resize-none"
        />
      </div>
      <SubmitButton label={place ? 'Save' : 'Add Place'} />
    </form>
  );
}

export default async function PlacesAdminPage() {
  const places = await getPlaces();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-8">Scenic Places / مکان‌های دیدنی</h1>

      {/* Create */}
      <div className="bg-bg border border-primary/20 rounded-2xl p-6 mb-10">
        <h2 className="font-heading text-base font-semibold text-primary mb-4">Add New Place</h2>
        <PlaceForm action={actionCreatePlace} />
      </div>

      {/* List */}
      <div className="space-y-6">
        {places.length === 0 ? (
          <p className="text-text-muted font-body text-sm">No places yet.</p>
        ) : (
          places.map((p: Place) => (
            <div key={p.id} className="bg-bg border border-primary/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-heading font-semibold text-primary">{p.nameFa} / {p.nameEn}</p>
                <form action={actionDeletePlace.bind(null, p.id)}>
                  <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-body transition-colors">Delete</button>
                </form>
              </div>
              <PlaceForm place={p} action={actionUpdatePlace} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
