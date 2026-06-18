import { getHeroWithSlides } from '@/lib/db/settings';
import {
  actionAddHeroSlide,
  actionUpdateHeroSlide,
  actionDeleteHeroSlide,
  actionUpdateRotationInterval,
} from '@/app/actions/settings';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField } from '@/components/admin/FieldRow';
import { Link } from '@/i18n/navigation';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default async function AdminHeroPage() {
  const hero = await getHeroWithSlides();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-2">Hero Slideshow</h1>
      <p className="text-sm text-text-muted font-body mb-8">
        Each slide has its own image and text. Slides display in order.
      </p>

      {/* Rotation interval */}
      <form action={actionUpdateRotationInterval} className="flex items-end gap-3 mb-10 bg-bg border border-primary/20 rounded-2xl p-4">
        <div className="flex-1">
          <label className="text-xs text-text-muted font-body uppercase tracking-wider block mb-1">
            Rotation interval (milliseconds)
          </label>
          <input
            type="number"
            name="rotationInterval"
            min={1000}
            step={500}
            defaultValue={hero.rotationInterval}
            className="w-full px-3 py-2 rounded-lg border border-primary/30 bg-bg font-body text-sm focus:outline-none focus:border-primary"
          />
          <p className="text-xs text-text-muted font-body mt-1">e.g. 5000 = 5 seconds</p>
        </div>
        <SubmitButton label="Save Interval" />
      </form>

      {/* Existing slides */}
      <div className="space-y-6 mb-10">
        {hero.slides.length === 0 ? (
          <p className="text-text-muted font-body text-sm">No slides yet. Add one below.</p>
        ) : (
          hero.slides.map((slide, idx) => (
            <div key={slide.id} className="bg-bg border border-primary/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-body text-text-muted uppercase tracking-wider">Slide {idx + 1}</span>
                <form action={actionDeleteHeroSlide.bind(null, slide.id)}>
                  <button type="submit" className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-body transition-colors">
                    Delete slide
                  </button>
                </form>
              </div>

              <form action={actionUpdateHeroSlide} className="space-y-3">
                <input type="hidden" name="id" value={slide.id} />
                <input type="hidden" name="order" value={idx} />

                <ImageUpload name="imageUrl" initialUrl={slide.imageUrl} label="Slide image" />

                <div className="grid sm:grid-cols-2 gap-3">
                  <InputField label="Eyebrow (EN)" name="eyebrowEn" defaultValue={slide.eyebrowEn} />
                  <InputField label="سربند (FA)" name="eyebrowFa" defaultValue={slide.eyebrowFa} dir="rtl" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <InputField label="Title (EN)" name="titleEn" defaultValue={slide.titleEn} />
                  <InputField label="عنوان (FA)" name="titleFa" defaultValue={slide.titleFa} dir="rtl" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <InputField label="Subtitle (EN)" name="subtitleEn" defaultValue={slide.subtitleEn} />
                  <InputField label="زیرعنوان (FA)" name="subtitleFa" defaultValue={slide.subtitleFa} dir="rtl" />
                </div>
                <SubmitButton label="Save slide" />
              </form>
            </div>
          ))
        )}
      </div>

      {/* Add new slide */}
      <div className="bg-primary-light border border-primary/20 rounded-2xl p-5">
        <h2 className="font-heading text-base font-semibold text-primary mb-4">Add New Slide</h2>
        <form action={actionAddHeroSlide} className="space-y-3">
          <input type="hidden" name="order" value={hero.slides.length} />

          <ImageUpload name="imageUrl" label="Slide image" />

          <div className="grid sm:grid-cols-2 gap-3">
            <InputField label="Eyebrow (EN)" name="eyebrowEn" />
            <InputField label="سربند (FA)" name="eyebrowFa" dir="rtl" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <InputField label="Title (EN)" name="titleEn" />
            <InputField label="عنوان (FA)" name="titleFa" dir="rtl" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <InputField label="Subtitle (EN)" name="subtitleEn" />
            <InputField label="زیرعنوان (FA)" name="subtitleFa" dir="rtl" />
          </div>
          <SubmitButton label="Add Slide" />
        </form>
      </div>
    </div>
  );
}
