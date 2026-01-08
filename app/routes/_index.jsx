import {useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import masterCraftsmanship from '~/assets/master-craftsmanship.jpg';
import precisionEngineering from '~/assets/precision-engineering.jpg';
import coastersImage from '~/assets/coasters.png';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Stone Creations | Luxury Marble Products'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}) {
  const heroCollectionHandle = HERO_COLLECTION_HANDLE;
  const {collection: heroCollection} = await context.storefront.query(
    HERO_PRODUCTS_QUERY,
    {handle: heroCollectionHandle},
  );
  const {collections} = await context.storefront.query(
    FEATURED_COLLECTION_QUERY,
  );
  const {collections: collectionsWithProducts} = await context.storefront.query(
    COLLECTIONS_WITH_PRODUCTS_QUERY,
  );

  return {
    heroProducts: heroCollection?.products?.nodes ?? [],
    featuredCollection: collections.nodes[0],
    collectionsWithProducts: collectionsWithProducts.nodes,
  };
}

function loadDeferredData() {
  return {};
}

export default function Homepage() {
  const data = useLoaderData();
  
  return (
    <div className="home-editorial">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
          
          .home-editorial {
            --font-serif: 'Playfair Display', Georgia, serif;
            --font-sans: 'DM Sans', sans-serif;
            --color-dark: #0d0d0d;
            --color-dark-deep: #080808;
            --color-light: #fafaf8;
            --color-muted: #6b6b6b;
            --color-accent: #9a8b7a;
            --color-gold: #b8a88a;
            --color-cream: #f5f2ed;
            background: var(--color-light);
            overflow-x: hidden;
            margin: 0;
            padding: 0;
          }
          
          /* ===== HERO SECTION ===== */
          .hero-full {
            display: flex;
            flex-direction: column;
            height: 100vh;
            height: 100dvh;
            margin: 0;
            padding: 0;
            position: relative;
          }
          
          .hero-visual {
            position: relative;
            width: 100%;
            flex: 1 1 auto;
            min-height: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #141414 100%);
            overflow: hidden;
          }
          
          /* Elegant ambient glow behind mosaic */
          .hero-visual::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 25%;
            width: 50%;
            height: 80%;
            transform: translate(-50%, -50%);
            background: radial-gradient(ellipse, rgba(184, 168, 138, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          }
          
          .hero-mosaic {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            grid-template-rows: repeat(6, 1fr);
            gap: 4px;
            padding: 4px;
            position: relative;
            z-index: 1;
          }
          
          .hero-mosaic-item {
            position: relative;
            display: block;
            overflow: hidden;
            border-radius: 3px;
            background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          }
          
          /* Subtle inner shadow for depth */
          .hero-mosaic-item::before {
            content: '';
            position: absolute;
            inset: 0;
            box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.4);
            z-index: 2;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
          }
          
          /* Elegant hover overlay */
          .hero-mosaic-item::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to bottom,
              transparent 0%,
              transparent 40%,
              rgba(0, 0, 0, 0.6) 100%
            );
            opacity: 0;
            transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 3;
            pointer-events: none;
          }
          
          .hero-mosaic-item:hover::after {
            opacity: 1;
          }
          
          .hero-mosaic-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
            filter: saturate(0.95) contrast(1.02);
          }
          
          .hero-mosaic-item:hover img {
            transform: scale(1.05);
            filter: saturate(1) contrast(1.05);
          }
          
          .hero-mosaic-item:nth-child(1) {
            grid-column: 1 / 7;
            grid-row: 1 / 7;
          }
          .hero-mosaic-item:nth-child(2) {
            grid-column: 7 / 13;
            grid-row: 1 / 4;
          }
          .hero-mosaic-item:nth-child(3) {
            grid-column: 7 / 10;
            grid-row: 4 / 7;
          }
          .hero-mosaic-item:nth-child(4) {
            grid-column: 10 / 13;
            grid-row: 4 / 7;
          }
          
          .hero-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(
              135deg,
              #1a1a1a 0%,
              #252525 35%,
              #1f1f1f 70%,
              #1a1a1a 100%
            );
            background-size: 300% 300%;
            animation: hero-shimmer 10s ease infinite;
          }
          
          @keyframes hero-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          /* Subtle grain texture overlay */
          .hero-overlay {
            pointer-events: none;
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
            z-index: 4;
          }
          
          /* Vignette effect */
          .hero-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 50%,
              rgba(0, 0, 0, 0.3) 100%
            );
          }
          
          .hero-content-strip {
            flex-shrink: 0;
            padding: 1.5rem 6%;
            background: linear-gradient(to right, #fafaf8 0%, #fff 50%, #fafaf8 100%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            position: relative;
            box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.03);
          }
          
          /* Subtle top accent line */
          .hero-content-strip::before {
            content: '';
            position: absolute;
            top: 0;
            left: 6%;
            right: 6%;
            height: 1px;
            background: linear-gradient(
              to right,
              transparent 0%,
              rgba(184, 168, 138, 0.4) 20%,
              rgba(184, 168, 138, 0.6) 50%,
              rgba(184, 168, 138, 0.4) 80%,
              transparent 100%
            );
          }
          
          .hero-text-group {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }
          
          .hero-title {
            font-family: var(--font-serif);
            font-size: 1.75rem;
            font-weight: 500;
            line-height: 1.25;
            color: var(--color-dark);
            margin: 0;
            letter-spacing: -0.01em;
          }
          
          .hero-subtitle {
            font-family: var(--font-sans);
            font-size: 0.9rem;
            font-weight: 400;
            line-height: 1.5;
            color: var(--color-muted);
            margin: 0;
            letter-spacing: 0.01em;
          }
          
          .hero-cta {
            flex-shrink: 0;
            font-family: var(--font-sans);
            font-size: 0.8rem;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #fff;
            text-decoration: none;
            padding: 1rem 2rem;
            background: var(--color-dark);
            border: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            white-space: nowrap;
            position: relative;
            overflow: hidden;
          }
          
          .hero-cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-accent) 100%);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hero-cta span {
            position: relative;
            z-index: 1;
          }
          
          .hero-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          
          .hero-cta:hover::before {
            transform: translateX(0);
          }

          /* ===== PHILOSOPHY SECTION ===== */
          .philosophy-section {
            padding: 6rem 6%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
            align-items: center;
            background: #fff;
            position: relative;
          }
          
          /* Subtle decorative accent */
          .philosophy-section::before {
            content: '';
            position: absolute;
            top: 6rem;
            left: 6%;
            width: 60px;
            height: 1px;
            background: var(--color-gold);
          }
          
          .philosophy-content {
            max-width: 500px;
          }
          
          .philosophy-title {
            font-family: var(--font-serif);
            font-size: clamp(2.25rem, 3.5vw, 3rem);
            font-weight: 500;
            line-height: 1.15;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
            letter-spacing: -0.02em;
          }
          
          .philosophy-text {
            font-family: var(--font-sans);
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.85;
            color: var(--color-muted);
            margin-bottom: 1.75rem;
          }
          
          .philosophy-features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-top: 3rem;
          }
          
          .philosophy-feature {
            padding-top: 1rem;
            border-top: 1px solid rgba(0,0,0,0.08);
          }
          
          .philosophy-feature h4 {
            font-family: var(--font-serif);
            font-size: 1.05rem;
            font-weight: 500;
            color: var(--color-dark);
            margin: 0 0 0.4rem 0;
          }
          
          .philosophy-feature p {
            font-family: var(--font-sans);
            font-size: 0.85rem;
            font-weight: 400;
            color: var(--color-muted);
            line-height: 1.6;
            margin: 0;
          }
          
          .philosophy-images {
            display: grid;
            grid-template-columns: 1fr 0.85fr;
            gap: 1rem;
            align-items: end;
          }
          
          .philosophy-img {
            width: 100%;
            height: auto;
            object-fit: cover;
            filter: saturate(0.95);
            transition: filter 0.4s ease;
          }
          
          .philosophy-img:hover {
            filter: saturate(1);
          }
          
          .philosophy-img:first-child {
            aspect-ratio: 3/4;
          }
          
          .philosophy-img:last-child {
            aspect-ratio: 4/5;
            margin-bottom: 3rem;
          }

          /* ===== PRODUCTS BY CATEGORY SECTION ===== */
          .products-by-category {
            padding: 5rem 6%;
            background: var(--color-cream);
            position: relative;
          }
          
          .products-section-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .products-section-header h2 {
            font-family: var(--font-serif);
            font-size: clamp(1.75rem, 2.5vw, 2.25rem);
            font-weight: 500;
            line-height: 1.1;
            margin: 0;
            color: var(--color-dark);
            letter-spacing: -0.01em;
          }
          
          .products-view-all-main {
            font-family: var(--font-sans);
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-muted);
            text-decoration: none;
            transition: color 0.3s ease;
            position: relative;
          }
          
          .products-view-all-main::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: var(--color-dark);
            transition: width 0.3s ease;
          }
          
          .products-view-all-main:hover {
            color: var(--color-dark);
          }
          
          .products-view-all-main:hover::after {
            width: 100%;
          }
          
          /* Products Grid */
          .products-grid-compact {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem 1.5rem;
          }
          
          /* Product Card - Clean minimal style */
          .product-card-minimal {
            text-decoration: none;
            color: inherit;
            display: block;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .product-card-minimal:hover {
            transform: translateY(-4px);
          }
          
          .product-img-wrap {
            position: relative;
            margin-bottom: 1rem;
            aspect-ratio: 1/1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 2px;
          }
          
          .product-img-wrap img {
            max-width: 85%;
            max-height: 85%;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .product-card-minimal:hover .product-img-wrap img {
            transform: scale(1.05);
          }
          
          .product-card-details {
            text-align: center;
            padding: 0 0.5rem;
          }
          
          .product-card-name {
            font-family: var(--font-serif);
            font-size: 1rem;
            font-weight: 500;
            margin: 0 0 0.3rem 0;
            color: var(--color-dark);
            line-height: 1.35;
          }
          
          .product-card-price {
            font-family: var(--font-sans);
            font-size: 0.85rem;
            font-weight: 400;
            color: var(--color-muted);
          }
          
          /* Override Hydrogen Money component styles */
          .product-card-price span,
          .product-card-price div,
          .product-card-price * {
            font-family: var(--font-sans) !important;
            font-size: inherit !important;
            font-weight: inherit !important;
          }
          
          /* Load More Button */
          .products-load-more {
            text-align: center;
            margin-top: 3rem;
          }
          
          .load-more-btn {
            font-family: var(--font-sans);
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-dark);
            background: transparent;
            border: 1px solid var(--color-dark);
            padding: 1rem 2.5rem;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .load-more-btn:hover {
            background: var(--color-dark);
            color: white;
          }
          
          /* Responsive */
          @media (max-width: 1100px) {
            .products-grid-compact {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (max-width: 768px) {
            .products-by-category {
              padding: 4rem 4%;
            }
            
            .products-grid-compact {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem 1rem;
            }
          }
          
          @media (max-width: 480px) {
            .products-section-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }
          }

          /* ===== CRAFTSMANSHIP SECTION ===== */
          .craftsmanship-editorial {
            padding: 0;
            background: #fff;
            position: relative;
          }
          
          .craftsmanship-layout {
            display: grid;
            grid-template-columns: 45% 55%;
            min-height: 85vh;
          }
          
          .craftsmanship-content {
            padding: 6rem 5rem 6rem 8%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: var(--color-cream);
            position: relative;
          }
          
          /* Decorative element */
          .craftsmanship-content::before {
            content: '';
            position: absolute;
            top: 6rem;
            left: 8%;
            width: 40px;
            height: 1px;
            background: var(--color-gold);
          }
          
          .craftsmanship-title {
            font-family: var(--font-serif);
            font-size: clamp(2.25rem, 3.5vw, 3rem);
            font-weight: 500;
            line-height: 1.15;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
            letter-spacing: -0.02em;
          }
          
          .craftsmanship-text {
            font-family: var(--font-sans);
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.85;
            color: var(--color-muted);
            max-width: 420px;
            margin-bottom: 3rem;
          }
          
          .craftsmanship-stats {
            display: flex;
            gap: 3.5rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0,0,0,0.08);
          }
          
          .stat-item {
            text-align: left;
          }
          
          .stat-number {
            font-family: var(--font-serif);
            font-size: 2.5rem;
            font-weight: 400;
            color: var(--color-dark);
            line-height: 1;
            margin-bottom: 0.4rem;
          }
          
          .stat-label {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-muted);
          }
          
          .craftsmanship-gallery {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 4px;
            padding: 0;
            background: var(--color-dark);
          }
          
          .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
            filter: saturate(0.9);
          }
          
          .gallery-image-wrapper {
            overflow: hidden;
          }
          
          .gallery-image-wrapper:hover .gallery-image {
            transform: scale(1.03);
            filter: saturate(1);
          }

          /* ===== FEATURED COLLECTION SHOWCASE ===== */
          .featured-showcase {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 85vh;
            background: linear-gradient(135deg, #f7f5f2 0%, #f0ebe5 50%, #ebe5dd 100%);
            overflow: hidden;
          }
          
          /* Subtle ambient glow */
          .featured-showcase::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 25%;
            width: 50%;
            height: 80%;
            transform: translate(-50%, -50%);
            background: radial-gradient(ellipse, rgba(184, 168, 138, 0.1) 0%, transparent 60%);
            pointer-events: none;
          }
          
          /* Left side - Image container */
          .featured-showcase-visual {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4rem;
          }
          
          .featured-showcase-img-frame {
            position: relative;
            width: 100%;
            max-width: 480px;
            aspect-ratio: 4/5;
          }
          
          /* Subtle frame accent */
          .featured-showcase-img-frame::before {
            content: '';
            position: absolute;
            top: -15px;
            left: -15px;
            right: 15px;
            bottom: 15px;
            border: 1px solid rgba(184, 168, 138, 0.25);
            z-index: 0;
          }
          
          .featured-showcase-img {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: cover;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
            filter: saturate(0.95);
            transition: filter 0.5s ease;
          }
          
          .featured-showcase-img:hover {
            filter: saturate(1);
          }
          
          /* Floating badge */
          .featured-showcase-badge {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            z-index: 2;
            background: var(--color-dark);
            color: white;
            padding: 0.6rem 1rem;
            font-family: var(--font-sans);
            font-size: 0.65rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
          }
          
          /* Right side - Content */
          .featured-showcase-content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 5rem 6rem 5rem 3rem;
            position: relative;
          }
          
          /* Vertical accent line */
          .featured-showcase-content::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 2px;
            height: 100px;
            background: linear-gradient(to bottom, transparent, var(--color-gold), transparent);
          }
          
          .featured-showcase-label {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--color-accent);
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .featured-showcase-label::before {
            content: '';
            width: 25px;
            height: 1px;
            background: var(--color-gold);
          }
          
          .featured-showcase-title {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 4.5vw, 4rem);
            font-weight: 500;
            line-height: 1.1;
            color: var(--color-dark);
            margin: 0 0 1.75rem 0;
            letter-spacing: -0.02em;
          }
          
          .featured-showcase-description {
            font-family: var(--font-sans);
            font-size: 0.95rem;
            font-weight: 400;
            line-height: 1.8;
            color: var(--color-muted);
            max-width: 400px;
            margin-bottom: 2.5rem;
          }
          
          /* Stats row */
          .featured-showcase-meta {
            display: flex;
            gap: 2.5rem;
            margin-bottom: 2.5rem;
            padding-top: 1.75rem;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
          }
          
          .featured-showcase-stat {
            text-align: left;
          }
          
          .featured-showcase-stat-value {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--color-dark);
            line-height: 1;
            margin-bottom: 0.3rem;
          }
          
          .featured-showcase-stat-label {
            font-family: var(--font-sans);
            font-size: 0.65rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-muted);
          }
          
          /* CTA Button */
          .featured-showcase-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            font-family: var(--font-sans);
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #fff;
            text-decoration: none;
            padding: 1rem 1.75rem;
            background: var(--color-dark);
            border: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .featured-showcase-cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-accent) 100%);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 0;
          }
          
          .featured-showcase-cta span,
          .featured-showcase-cta-arrow {
            position: relative;
            z-index: 1;
          }
          
          .featured-showcase-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
          
          .featured-showcase-cta:hover::before {
            transform: translateX(0);
          }
          
          .featured-showcase-cta-arrow {
            transition: transform 0.3s ease;
          }
          
          .featured-showcase-cta:hover .featured-showcase-cta-arrow {
            transform: translateX(4px);
          }
          
          /* Placeholder for no-image state */
          .featured-showcase-placeholder {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(
              135deg,
              #e8e2da 0%,
              #f5f0eb 25%,
              #ebe5dc 50%,
              #f2ece4 75%,
              #e5dfd6 100%
            );
            background-size: 400% 400%;
            animation: marble-shimmer 8s ease infinite;
            box-shadow: 0 30px 70px rgba(0, 0, 0, 0.12);
          }
          
          @keyframes marble-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .featured-showcase-img-frame.no-image::before {
            border-color: rgba(184, 168, 138, 0.15);
          }
          
          .placeholder-icon {
            font-family: var(--font-serif);
            font-size: 3.5rem;
            color: var(--color-accent);
            opacity: 0.5;
            margin-bottom: 1rem;
          }
          
          .placeholder-text {
            font-family: var(--font-serif);
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--color-dark);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.6;
          }

          /* Responsive */
          @media (max-width: 1024px) {
            .featured-showcase {
              grid-template-columns: 1fr;
              min-height: auto;
            }
            
            .featured-showcase-visual {
              padding: 3rem 2rem;
              order: 1;
            }
            
            .featured-showcase-content {
              padding: 3rem 2rem;
              order: 2;
            }
            
            .featured-showcase-content::before {
              display: none;
            }
            
            .featured-showcase-img-frame {
              max-width: 380px;
              margin: 0 auto;
            }
          }
          
          @media (max-width: 640px) {
            .featured-showcase-visual {
              padding: 2rem 1.5rem;
            }
            
            .featured-showcase-content {
              padding: 2rem 1.5rem 3rem;
            }
            
            .featured-showcase-meta {
              flex-direction: column;
              gap: 1.25rem;
            }
            
            .featured-showcase-img-frame::before {
              display: none;
            }
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 900px) {
            .hero-full {
              height: 100vh;
              height: 100dvh;
            }
            
            .hero-mosaic {
              grid-template-columns: repeat(2, 1fr);
              grid-template-rows: repeat(2, 1fr);
              gap: 3px;
              padding: 3px;
            }
            
            .hero-mosaic-item:nth-child(1),
            .hero-mosaic-item:nth-child(2),
            .hero-mosaic-item:nth-child(3),
            .hero-mosaic-item:nth-child(4) {
              grid-column: auto;
              grid-row: auto;
            }
            
            .hero-mosaic-item {
              border-radius: 2px;
            }
            
            .hero-content-strip {
              flex-direction: column;
              align-items: flex-start;
              gap: 1.25rem;
              padding: 1.5rem 5%;
            }
            
            .hero-content-strip::before {
              left: 5%;
              right: 5%;
            }
            
            .hero-title {
              font-size: 1.5rem;
            }
            
            .hero-subtitle {
              font-size: 0.85rem;
            }
            
            .hero-cta {
              width: 100%;
              text-align: center;
              padding: 1.1rem 2rem;
            }
            
            .philosophy-section {
              grid-template-columns: 1fr;
              gap: 3rem;
              padding: 4rem 4%;
            }
            
            .philosophy-images {
              order: -1;
            }
            
            .craftsmanship-layout {
              grid-template-columns: 1fr;
            }
            
            .craftsmanship-content {
              padding: 4rem 4%;
            }
            
            .craftsmanship-gallery {
              height: 50vh;
            }
          }
          
          @media (max-width: 640px) {
            .hero-mosaic {
              gap: 2px;
              padding: 2px;
            }
            
            .hero-mosaic-item {
              border-radius: 2px;
            }
            
            .hero-content-strip {
              padding: 1.25rem 4%;
            }
            
            .hero-title {
              font-size: 1.35rem;
            }
            
            .philosophy-features {
              grid-template-columns: 1fr;
            }
            
            .philosophy-images {
              grid-template-columns: 1fr;
            }
            
            .philosophy-img:last-child {
              margin-bottom: 0;
            }
            
            .craftsmanship-stats {
              flex-direction: column;
              gap: 2rem;
            }
          }
        `}
      </style>

      <HeroSection products={data.heroProducts} collectionsWithProducts={data.collectionsWithProducts} />
      <PhilosophySection />
      <ProductsSection collections={data.collectionsWithProducts} />
      {data.featuredCollection && (
        <FeaturedShowcase collection={data.featuredCollection} />
      )}
      <CraftsmanshipSection />
    </div>
  );
}

function HeroSection({products, collectionsWithProducts}) {
  const heroProducts =
    (products?.length ? products : getHeroFallbackProducts(collectionsWithProducts)) ||
    [];

  const curatedItems = getCuratedHeroItems(heroProducts);

  const withImages = (curatedItems.length
    ? curatedItems
    : heroProducts
        .map((p) => ({product: p, image: p?.images?.nodes?.[0]}))
        .filter((x) => x.image)
  ).slice(0, 4);

  return (
    <section className="hero-full">
      <div className="hero-visual" aria-label="Featured products">
        {withImages.length ? (
          <div className="hero-mosaic">
            {withImages.map(({product, image, key}) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className={`hero-mosaic-item ${
                  key ? `hero-mosaic-item--${key}` : ''
                }`}
                aria-label={product.title}
              >
                <Image
                  data={image}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="hero-placeholder" aria-hidden="true" />
        )}
        <div className="hero-overlay" aria-hidden="true" />
      </div>
      <div className="hero-content-strip">
        <div className="hero-text-group">
          <h1 className="hero-title">Artisan Marble for Discerning Spaces</h1>
          <p className="hero-subtitle">
            Handcrafted pieces that celebrate the natural beauty of stone.
          </p>
        </div>
        <Link to="/collections/all" className="hero-cta">
          <span>Shop Collection</span>
        </Link>
      </div>
    </section>
  );
}

function getHeroFallbackProducts(collectionsWithProducts) {
  const validCollections =
    collectionsWithProducts?.filter(
      (collection) =>
        collection?.products?.nodes?.length > 0 &&
        collection.title?.toLowerCase() !== 'homepage',
    ) || [];

  const seenIds = new Set();
  const allProducts = validCollections
    .flatMap((c) => c.products.nodes)
    .filter((product) => {
      if (!product?.id) return false;
      if (seenIds.has(product.id)) return false;
      seenIds.add(product.id);
      return true;
    });

  return allProducts;
}

const HERO_PRODUCT_PREFERENCES = [
  {
    key: 'cutting-board',
    titlePattern: /cutting\s*board/i,
    preferredImageIndex: 3, // 4th image
    overrideImage:
      'https://cdn.shopify.com/s/files/1/0660/6713/6566/files/cutting-board-display.png?v=1764691415&width=1000&height=1500&crop=center',
  },
  {
    key: 'coaster',
    titlePattern: /coaster/i,
    preferredImageIndex: 3, // 4th image
    overrideImage: coastersImage,
  },
  {
    key: 'serving-board',
    titlePattern: /serving\s*board/i,
    preferredImageIndex: 3, // 4th image
    overrideImage:
      'https://cdn.shopify.com/s/files/1/0660/6713/6566/files/serving-board-white-scene.png?v=1764595188&width=1000&height=1000&crop=center',
  },
  {
    key: 'waste-basket',
    titlePattern: /(waste\s*basket|wastebasket|trash\s*can|bin)/i,
    preferredImageIndex: 3, // 4th image
    overrideImage:
      'https://cdn.shopify.com/s/files/1/0660/6713/6566/files/waste-display.png?v=1764697371&width=1000&height=1000&crop=center',
  },
];

function getCuratedHeroItems(products) {
  if (!Array.isArray(products) || products.length === 0) return [];

  const usedIds = new Set();
  const items = HERO_PRODUCT_PREFERENCES.map((pref) => {
    const product = products.find(
      (p) =>
        p?.title &&
        pref.titlePattern?.test(p.title) &&
        !usedIds.has(p.id),
    );

    const image = pickHeroImage(product, pref);

    if (!product || !image) return null;
    usedIds.add(product.id);
    return {product, image, key: pref.key};
  }).filter(Boolean);

  return items;
}

function pickHeroImage(product, pref) {
  if (pref?.overrideImage) {
    if (typeof pref.overrideImage === 'string') {
      return buildImageDataFromUrl(pref.overrideImage, product?.title);
    }
    return pref.overrideImage;
  }
  return pickPreferredProductImage(product, pref?.preferredImageIndex);
}

function buildImageDataFromUrl(url, fallbackAltText) {
  let width;
  let height;

  try {
    const u = new URL(url);
    const w = u.searchParams.get('width');
    const h = u.searchParams.get('height');
    width = w ? Number(w) : undefined;
    height = h ? Number(h) : undefined;
  } catch {
    // ignore parse errors, width/height remain undefined
  }

  return {
    url,
    altText: fallbackAltText || null,
    width: Number.isFinite(width) ? width : null,
    height: Number.isFinite(height) ? height : null,
  };
}

function pickPreferredProductImage(product, preferredIndex) {
  const nodes = product?.images?.nodes || [];
  if (!nodes.length) return null;
  if (typeof preferredIndex === 'number') {
    return nodes[preferredIndex] ?? nodes[nodes.length - 1] ?? nodes[0];
  }
  return nodes[0];
}

function PhilosophySection() {
  return (
    <section className="philosophy-section">
      <div className="philosophy-content">
        <h2 className="philosophy-title">
          Designed for Those<br />
          Who Demand Distinction
        </h2>
        <p className="philosophy-text">
          We understand that true luxury lies in the details. Our marble 
          products are conceived in collaboration with architects and 
          designers who refuse to compromise on beauty or quality.
        </p>
        <p className="philosophy-text">
          Every piece begins with the careful selection of stone from the 
          world's most prestigious quarries, transformed by master craftsmen 
          into objects of enduring elegance.
        </p>
        
        <div className="philosophy-features">
          <div className="philosophy-feature">
            <h4>Bespoke Dimensions</h4>
            <p>Custom-crafted to your exact specifications</p>
          </div>
          <div className="philosophy-feature">
            <h4>Curated Materials</h4>
            <p>Hand-selected from premium quarries worldwide</p>
          </div>
          <div className="philosophy-feature">
            <h4>White Glove Service</h4>
            <p>Dedicated support from concept to installation</p>
          </div>
          <div className="philosophy-feature">
            <h4>Timeless Quality</h4>
            <p>Pieces designed to outlast generations</p>
          </div>
        </div>
      </div>
      
      <div className="philosophy-images">
        <img 
          className="philosophy-img" 
          src={masterCraftsmanship} 
          alt="Master craftsmanship in marble work" 
        />
        <img 
          className="philosophy-img" 
          src={precisionEngineering} 
          alt="Precision engineering of marble" 
        />
      </div>
    </section>
  );
}

function ProductsSection({collections}) {
  // Filter out Homepage and collections with no products, then flatten all products
  const validCollections = collections?.filter(
    (collection) => 
      collection.products?.nodes?.length > 0 && 
      collection.title.toLowerCase() !== 'homepage'
  ) || [];
  
  // Get unique products from all collections (avoid duplicates by product id)
  const seenIds = new Set();
  const allProducts = validCollections.flatMap(c => c.products.nodes).filter(product => {
    if (seenIds.has(product.id)) return false;
    seenIds.add(product.id);
    return true;
  });
  
  // Show first 8 products initially
  const displayProducts = allProducts.slice(0, 8);

  return (
    <section className="products-by-category" id="shop">
      <div className="products-section-header">
        <h2>Curated Pieces</h2>
        <Link to="/collections/all" className="products-view-all-main">
          View All
        </Link>
      </div>
      
      {displayProducts.length > 0 ? (
        <>
          <div className="products-grid-compact">
            {displayProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="product-card-minimal"
              >
                <div className="product-img-wrap">
                  {product.images?.nodes?.[0] && (
                    <Image
                      data={product.images.nodes[0]}
                      sizes="(min-width: 1100px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                  )}
                </div>
                <div className="product-card-details">
                  <h4 className="product-card-name">{product.title}</h4>
                  <span className="product-card-price">
                    <Money data={product.priceRange.minVariantPrice} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="products-load-more">
            <Link to="/collections/all">
              <button className="load-more-btn">Discover More</button>
            </Link>
          </div>
        </>
      ) : (
        <div style={{textAlign: 'center', padding: '2rem'}}>
          No products available
        </div>
      )}
    </section>
  );
}

function CraftsmanshipSection() {
  return (
    <section className="craftsmanship-editorial">
      <div className="craftsmanship-layout">
        <div className="craftsmanship-content">
          <h2 className="craftsmanship-title">
            The Art of<br />
            Transformation
          </h2>
          <p className="craftsmanship-text">
            From raw geological wonder to refined object of desire—each piece 
            undergoes a meticulous journey. Our master artisans combine 
            centuries-old techniques with contemporary precision to reveal 
            the inherent beauty within every block of marble.
          </p>
          
          <div className="craftsmanship-stats">
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Made in USA</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Stone Varieties</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Unique Patterns</div>
            </div>
          </div>
        </div>
        
        <div className="craftsmanship-gallery">
          <div className="gallery-image-wrapper">
            <img 
              className="gallery-image" 
              src={masterCraftsmanship} 
              alt="Master craftsmanship" 
            />
          </div>
          <div className="gallery-image-wrapper">
            <img 
              className="gallery-image" 
              src={precisionEngineering} 
              alt="Precision engineering" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedShowcase({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  
  return (
    <section className="featured-showcase">
      <div className="featured-showcase-visual">
        <div className={`featured-showcase-img-frame ${!image ? 'no-image' : ''}`}>
          <span className="featured-showcase-badge">Featured</span>
          {image ? (
            <Image 
              className="featured-showcase-img"
              data={image} 
              sizes="(min-width: 1024px) 50vw, 100vw" 
            />
          ) : (
            <div className="featured-showcase-placeholder">
              <div className="placeholder-icon">◊</div>
              <span className="placeholder-text">{collection.title}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="featured-showcase-content">
        <span className="featured-showcase-label">Collection Spotlight</span>
        <h2 className="featured-showcase-title">{collection.title}</h2>
        <p className="featured-showcase-description">
          Discover our curated selection of artisan pieces, each meticulously 
          crafted to bring enduring elegance to your space. From the quarry 
          to your home, every item tells a story of craftsmanship.
        </p>
        
        <div className="featured-showcase-meta">
          <div className="featured-showcase-stat">
            <div className="featured-showcase-stat-value">Premium</div>
            <div className="featured-showcase-stat-label">Materials</div>
          </div>
          <div className="featured-showcase-stat">
            <div className="featured-showcase-stat-value">Artisan</div>
            <div className="featured-showcase-stat-label">Crafted</div>
          </div>
          <div className="featured-showcase-stat">
            <div className="featured-showcase-stat-value">Unique</div>
            <div className="featured-showcase-stat-label">Designs</div>
          </div>
        </div>
        
        <Link 
          to={`/collections/${collection.handle}`} 
          className="featured-showcase-cta"
        >
          <span>Explore Collection</span>
          <span className="featured-showcase-cta-arrow">→</span>
        </Link>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const COLLECTIONS_WITH_PRODUCTS_QUERY = `#graphql
  fragment CollectionProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  fragment CollectionWithProducts on Collection {
    id
    title
    handle
    products(first: 4) {
      nodes {
        ...CollectionProduct
      }
    }
  }
  query CollectionsWithProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 6) {
      nodes {
        ...CollectionWithProducts
      }
    }
  }
`;

const HERO_COLLECTION_HANDLE = 'homepage-hero';

const HERO_PRODUCTS_QUERY = `#graphql
  fragment HeroProduct on Product {
    id
    title
    handle
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query HeroProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      products(first: 8) {
        nodes {
          ...HeroProduct
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

