import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'
import { getGalleryMedia, getVideoThumbnail } from '@/utils/media'
import { ProductDetailsFragment, ProductMediaFragment, ProductVariantDetailsFragment } from '@/generated/graphql'

export interface ProductGalleryProps {
  product: ProductDetailsFragment
  selectedVariant?: ProductVariantDetailsFragment
}

export function ProductGallery({ product, selectedVariant }: ProductGalleryProps) {
  const [expandedImage, setExpandedImage] = useState<ProductMediaFragment | undefined>(undefined)
  const [videoToPlay, setVideoToPlay] = useState<ProductMediaFragment | undefined>(undefined)

  const galleryMedia = getGalleryMedia({ product, selectedVariant })

  return (
    <>
      <div
        className={clsx(
          'mb-2 mt-1 grid h-96 max-h-screen w-full grid-cols-1 gap-2 overflow-scroll scrollbar-hide md:h-full',
          galleryMedia.length > 1 && 'md:col-span-2 md:grid-cols-2'
        )}
        style={{
          scrollSnapType: 'both mandatory',
        }}
      >
        {galleryMedia?.map((media: ProductMediaFragment) => {
          const videoThumbnailUrl = getVideoThumbnail(media.url)
          return (
            <div
              key={media.url}
              className="relative aspect-square"
              style={{
                scrollSnapAlign: 'start',
              }}
            >
              {media.type === 'IMAGE' && (
                <Image
                  //onClick={() => setExpandedImage(media)}
                  src={media.url}
                  alt={media.alt}
                  fill
                  role="button"
                  //tabIndex={-2}
                  //priority
                  className="object-cover"
                />
              )}
              {media.type === 'VIDEO' && (
                <div
                  role="button"
                  tabIndex={-2}
                  //onClick={() => {
                  //  setVideoToPlay(media)
                  //}}
                  //onKeyDown={(e) => {
                  //  if (e.key === 'Enter') {
                  //    setVideoToPlay(media)
                  //  }
                  //}}
                >
                  {videoThumbnailUrl && (
                    <Image src={videoThumbnailUrl} alt={media.alt} layout="fill" objectFit="cover" />
                  )}
                  {/*<div className="absolute flex h-full w-full transform items-center justify-center bg-transparent transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-110">
                    <PlayIcon className="h-12 w-12" />
                  </div>*/}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
