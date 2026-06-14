'use client'
import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

interface PhotoGalleryProps {
  images: string[]
  title: string
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox = (idx: number) => setLightboxIdx(idx)
  const closeLightbox = () => setLightboxIdx(null)
  const prev = () => setLightboxIdx(i => (i! > 0 ? i! - 1 : images.length - 1))
  const next = () => setLightboxIdx(i => (i! < images.length - 1 ? i! + 1 : 0))

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[360px] md:h-[480px] rounded-card overflow-hidden">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative cursor-pointer" onClick={() => openLightbox(0)}>
          <Image
            src={images[0]}
            alt={`${title} - photo 1`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
        {/* Secondary images */}
        {images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            className="relative cursor-pointer overflow-hidden"
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={img}
              alt={`${title} - photo ${i + 2}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
            {/* Show all button on last visible */}
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <button className="flex items-center gap-2 bg-white text-ink text-sm font-semibold px-4 py-2 rounded-btn">
                  <Images className="w-4 h-4" />
                  +{images.length - 5} more
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show all photos button */}
      <button
        onClick={() => openLightbox(0)}
        className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink border border-gray-300 px-4 py-2 rounded-btn hover:bg-gray-50 transition-colors"
      >
        <Images className="w-4 h-4" />
        Show all {images.length} photos
      </button>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>

          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <div className="relative w-full max-w-4xl h-[70vh] px-16" onClick={e => e.stopPropagation()}>
            <Image
              src={images[lightboxIdx]}
              alt={`${title} - photo ${lightboxIdx + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white/60 text-sm">
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
