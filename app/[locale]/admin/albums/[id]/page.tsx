import { notFound } from 'next/navigation';
import { getAlbum } from '@/lib/db/albums';
import { getMedia } from '@/lib/db/media';
import { actionUpdateAlbum, actionDeleteAlbum, actionAssignMedia } from '@/app/actions/albums';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { InputField, TextareaField } from '@/components/admin/FieldRow';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

export default async function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [album, allPhotos] = await Promise.all([getAlbum(id), getMedia('photo')]);
  if (!album) notFound();

  const update = actionUpdateAlbum.bind(null, id);
  const del = actionDeleteAlbum.bind(null, id);

  const albumPhotoIds = new Set(album.media.map((m) => m.id));

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <Link href="/admin/albums" className="text-sm text-accent hover:underline font-body mb-6 inline-block">← Albums</Link>
      <h1 className="font-heading text-2xl font-bold text-primary mb-6">Edit Album</h1>

      {/* Edit form */}
      <form action={update} className="space-y-4 bg-bg border border-primary/20 rounded-2xl p-6 mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Title (English)" name="titleEn" defaultValue={album.titleEn} required />
          <InputField label="Title (Persian / فارسی)" name="titleFa" defaultValue={album.titleFa} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextareaField label="Description (English)" name="descriptionEn" defaultValue={album.descriptionEn ?? ''} rows={2} />
          <TextareaField label="Description (Persian / فارسی)" name="descriptionFa" defaultValue={album.descriptionFa ?? ''} rows={2} />
        </div>
        <ImageUpload name="coverUrl" initialUrl={album.coverUrl ?? undefined} label="Cover image (optional)" />
        <SubmitButton label="Save Changes" />
      </form>

      {/* Photo assignment */}
      <div className="bg-bg border border-primary/20 rounded-2xl p-5 mb-6">
        <h2 className="font-heading text-base font-semibold text-primary mb-4">
          Photos in this album ({album.media.length})
        </h2>
        {allPhotos.length === 0 ? (
          <p className="text-sm text-text-muted font-body">No photos uploaded yet. <Link href="/admin/media" className="text-accent hover:underline">Add photos</Link></p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {allPhotos.map((photo) => {
              const inAlbum = albumPhotoIds.has(photo.id);
              const assign = actionAssignMedia.bind(null, photo.id, inAlbum ? '' : id);
              return (
                <form key={photo.id} action={assign}>
                  <button
                    type="submit"
                    className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      inAlbum
                        ? 'border-accent ring-2 ring-accent/30'
                        : 'border-primary/20 hover:border-primary/50'
                    }`}
                    title={inAlbum ? 'Remove from album' : 'Add to album'}
                  >
                    <Image src={photo.url} alt={photo.captionEn ?? ''} fill className="object-cover" />
                    {inAlbum && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <span className="text-white text-lg drop-shadow">✓</span>
                      </div>
                    )}
                  </button>
                </form>
              );
            })}
          </div>
        )}
        <p className="text-xs text-text-muted font-body mt-3">Click a photo to add/remove it from this album.</p>
      </div>

      <form action={del}><DeleteButton /></form>
    </div>
  );
}
