import { getHero } from '@/lib/db/settings';
import { actionUpdateHero } from '@/app/actions/settings';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';

export default async function AdminHeroPage() {
  const hero = await getHero();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Hero Slideshow</h1>

      <form action={actionUpdateHero} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6">
        <TextareaField
          label="Slide image URLs (one per line)"
          name="imageUrls"
          rows={4}
          defaultValue={hero.imageUrls.join('\n')}
          placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Eyebrow (English)" name="eyebrowEn" defaultValue={hero.eyebrowEn} />
          <InputField label="Eyebrow (Persian / فارسی)" name="eyebrowFa" defaultValue={hero.eyebrowFa} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" defaultValue={hero.titleEn} />
          <InputField label="Title (Persian / فارسی)" name="titleFa" defaultValue={hero.titleFa} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Subtitle (English)" name="subtitleEn" defaultValue={hero.subtitleEn} />
          <InputField label="Subtitle (Persian / فارسی)" name="subtitleFa" defaultValue={hero.subtitleFa} />
        </div>
        <SubmitButton label="Save Hero" />
      </form>
    </div>
  );
}
