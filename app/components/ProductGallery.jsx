import {useEffect, useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';

/**
 * @param {{
 *  images: Array<{
 *    id: string;
 *    altText?: string | null;
 *    url: string;
 *    width?: number | null;
 *    height?: number | null;
 *  }>;
 *  selectedVariantImage?: {
 *    id?: string;
 *    altText?: string | null;
 *    url?: string | null;
 *    width?: number | null;
 *    height?: number | null;
 *  } | null;
 * }}
 */
export function ProductGallery({images, selectedVariantImage}) {
  const imageList = useMemo(() => images ?? [], [images]);
  const [activeId, setActiveId] = useState(() => {
    return selectedVariantImage?.id || imageList[0]?.id || null;
  });

  useEffect(() => {
    if (selectedVariantImage?.id) {
      setActiveId(selectedVariantImage.id);
    }
  }, [selectedVariantImage?.id]);

  const activeImage =
    imageList.find((img) => img.id === activeId) || imageList[0] || null;

  if (!activeImage && imageList.length === 0) {
    return <div className="product-image" />;
  }

  return (
    <div className="product-gallery">
      <style>
        {`
          .product-gallery {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .product-gallery-main {
            border: 1px solid #eee;
            border-radius: 10px;
            overflow: hidden;
            background: #fafafa;
          }
          .product-gallery-thumbs {
            display: grid;
            grid-template-columns: repeat(auto-fill, 80px);
            gap: 0.5rem;
            justify-content: start;
          }
          .product-gallery-thumb {
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            background: #fff;
            padding: 2px;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
            width: 80px;
            height: 80px; /* make square */
            display: block;
          }
          .product-gallery-thumb.active {
            border-color: #111;
            box-shadow: 0 0 0 2px #111 inset;
          }
          @media (max-width: 768px) {
            .product-gallery-thumbs {
              grid-template-columns: repeat(auto-fill, 64px);
            }
            .product-gallery-thumb { width: 64px; height: 64px; }
          }
        `}
      </style>

      {/* Main image */}
      {activeImage && (
        <div className="product-gallery-main">
          <Image
            alt={activeImage.altText || 'Product image'}
            data={activeImage}
            key={activeImage.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            loading="eager"
            style={{width: '100%', height: 'auto', objectFit: 'contain'}}
          />
        </div>
      )}

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="product-gallery-thumbs">
          {imageList.map((img) => (
            <button
              type="button"
              key={img.id}
              className={`product-gallery-thumb${
                img.id === activeId ? ' active' : ''
              }`}
              onClick={() => setActiveId(img.id)}
              aria-label={`View image`}
            >
              <Image
                alt={img.altText || 'Product thumbnail'}
                data={img}
                sizes="80px"
                loading="lazy"
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */



