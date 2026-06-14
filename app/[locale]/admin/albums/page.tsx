import { getAlbums } from '@/lib/db/albums';
import { actionCreateAlbum } from '@/app/actions/albums';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default async function AdminAlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      <Link href="/admin" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Admin</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Albums</h1>

      {/* Create form */}
      <form action={actionCreateAlbum} className="bg-bg border border-primary/20 rounded-2xl p-5 mb-8 space-y-4">
        <h2 className="font-heading text-base font-semibold text-primary">New album</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" required />
          <InputField label="Title (Persian / فارسی)" name="titleFa" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Description (English)" name="descriptionEn" rows={2} />
          <TextareaField label="Description (Persian / فارسی)" name="descriptionFa" rows={2} />
        </div>
        <ImageUpload name="coverUrl" label="Cover image (optional — auto-uses first photo if blank)" />
        <SubmitButton label="Create Album" />
      </form>

      {/* Albums list */}
      <div className="space-y-3">
        {albums.map((album) => {
          const cover = album.coverUrl ?? album.media[0]?.url;
          return (
            <Link
              key={album.id}
              href={`/admin/albums/${album.id}`}
              className="flex items-center gap-4 bg-bg border border-primary/20 rounded-2xl p-3 hover:border-primary/50 hover:shadow-sm transition-all group"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary-light flex-shrink-0">
                {cover ? (
                  <Image src={cover} alt={album.titleEn} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-xl">🖼️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-primary text-sm group-hover:text-primary/80 transition-colors">
                  {album.titleEn} / {album.titleFa}
                </p>
                <p className="text-xs text-text-muted font-body mt-0.5">
                  {album._count.media} {album._count.media === 1 ? 'photo' : 'photos'}
                </p>
              </div>
              <span className="text-text-muted group-hover:text-accent transition-colors text-sm flex-shrink-0">Edit →</span>
            </Link>
          );
        })}
        {albums.length === 0 && <p className="text-text-muted font-body text-sm">No albums yet.</p>}
      </div>
    </div>
  );
}
