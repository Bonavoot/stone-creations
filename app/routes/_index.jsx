import {useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import masterCraftsmanship from '~/assets/master-craftsmanship.jpg';
import precisionEngineering from '~/assets/precision-engineering.jpg';

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
  const {collections} = await context.storefront.query(
    FEATURED_COLLECTION_QUERY,
  );
  const {collections: collectionsWithProducts} = await context.storefront.query(
    COLLECTIONS_WITH_PRODUCTS_QUERY,
  );

  return {
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
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
          
          .home-editorial {
            --font-serif: 'Cormorant Garamond', Georgia, serif;
            --font-sans: 'Outfit', sans-serif;
            --color-dark: #151515;
            --color-dark-deep: #111;
            --color-light: #fafafa;
            --color-muted: #666;
            --color-accent: #8b7355;
            background: var(--color-light);
            overflow-x: hidden;
          }
          
          /* Subtle grain texture overlay */
          .home-editorial::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0.03;
            z-index: 1000;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }

          /* ===== HERO SECTION ===== */
          .hero-editorial {
            position: relative;
            width: 100%;
            height: 90vh;
            min-height: 600px;
            max-height: 1000px;
            overflow: hidden;
          }
          
          .hero-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 48%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 4rem 4rem 4rem 6%;
            background: linear-gradient(90deg, var(--color-light) 0%, var(--color-light) 55%, rgba(250,250,250,0.9) 75%, transparent 100%);
            z-index: 2;
          }
          
          .hero-eyebrow {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: var(--color-accent);
            margin-bottom: 2rem;
            font-weight: 400;
            opacity: 0;
            animation: fadeSlideUp 0.8s ease forwards;
            animation-delay: 0.2s;
          }
          
          .hero-title {
            font-family: var(--font-serif);
            font-size: clamp(3rem, 6vw, 5.5rem);
            font-weight: 300;
            line-height: 1.05;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
            letter-spacing: -0.02em;
            opacity: 0;
            animation: fadeSlideUp 0.8s ease forwards;
            animation-delay: 0.4s;
          }
          
          .hero-title em {
            font-style: italic;
            font-weight: 300;
          }
          
          .hero-subtitle {
            font-family: var(--font-sans);
            font-size: 1.1rem;
            font-weight: 300;
            line-height: 1.7;
            color: var(--color-muted);
            max-width: 380px;
            margin-bottom: 3rem;
            opacity: 0;
            animation: fadeSlideUp 0.8s ease forwards;
            animation-delay: 0.6s;
          }
          
          .hero-cta {
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            font-family: var(--font-sans);
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--color-dark);
            text-decoration: none;
            padding: 1rem 0;
            position: relative;
            font-weight: 400;
            opacity: 0;
            animation: fadeSlideUp 0.8s ease forwards;
            animation-delay: 0.8s;
            transition: color 0.3s ease;
          }
          
          .hero-cta::after {
            content: '';
            position: absolute;
            bottom: 0.5rem;
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--color-dark);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.4s ease;
          }
          
          .hero-cta:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }
          
          .hero-cta-arrow {
            transition: transform 0.3s ease;
          }
          
          .hero-cta:hover .hero-cta-arrow {
            transform: translateX(5px);
          }
          
          .hero-image-container {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          
          .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center right;
            opacity: 0;
            animation: fadeIn 1.2s ease forwards;
            animation-delay: 0.3s;
          }
          
          .hero-image-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(250,250,250,0.1) 0%, transparent 50%);
            pointer-events: none;
          }
          
          .hero-scroll-indicator {
            position: absolute;
            bottom: 3rem;
            left: 8%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            opacity: 0;
            animation: fadeIn 0.8s ease forwards;
            animation-delay: 1.2s;
          }
          
          .hero-scroll-text {
            font-family: var(--font-sans);
            font-size: 0.65rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--color-muted);
            writing-mode: vertical-rl;
          }
          
          .hero-scroll-line {
            width: 1px;
            height: 60px;
            background: linear-gradient(to bottom, var(--color-dark), transparent);
            animation: scrollPulse 2s ease-in-out infinite;
          }
          
          @keyframes fadeSlideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes scrollPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          /* ===== PHILOSOPHY SECTION ===== */
          .philosophy-section {
            padding: 12rem 8%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8rem;
            align-items: center;
            background: white;
            position: relative;
          }
          
          .philosophy-section::before {
            content: '01';
            position: absolute;
            top: 4rem;
            left: 8%;
            font-family: var(--font-serif);
            font-size: 0.9rem;
            color: var(--color-accent);
            letter-spacing: 0.1em;
          }
          
          .philosophy-content {
            max-width: 480px;
          }
          
          .philosophy-title {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 4vw, 3.5rem);
            font-weight: 300;
            line-height: 1.15;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
            letter-spacing: -0.01em;
          }
          
          .philosophy-text {
            font-family: var(--font-sans);
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.9;
            color: var(--color-muted);
            margin-bottom: 2rem;
          }
          
          .philosophy-features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-top: 3rem;
          }
          
          .philosophy-feature {
            padding-top: 1rem;
            border-top: 1px solid rgba(0,0,0,0.1);
          }
          
          .philosophy-feature h4 {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            font-weight: 400;
            color: var(--color-dark);
            margin: 0 0 0.5rem 0;
          }
          
          .philosophy-feature p {
            font-family: var(--font-sans);
            font-size: 0.85rem;
            font-weight: 300;
            color: var(--color-muted);
            line-height: 1.6;
            margin: 0;
          }
          
          .philosophy-images {
            display: grid;
            grid-template-columns: 1fr 0.85fr;
            gap: 1.5rem;
            align-items: end;
          }
          
          .philosophy-img {
            width: 100%;
            height: auto;
            object-fit: cover;
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
            padding: 4rem 6%;
            background: var(--color-light);
          }
          
          .products-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }
          
          .products-section-header h2 {
            font-family: var(--font-serif);
            font-size: clamp(1.8rem, 3vw, 2.5rem);
            font-weight: 300;
            line-height: 1.1;
            margin: 0;
            color: var(--color-dark);
          }
          
          .products-view-all-main {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--color-muted);
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .products-view-all-main:hover {
            color: var(--color-dark);
          }
          
          /* Products Grid */
          .products-grid-compact {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem 1rem;
          }
          
          /* Product Card - Clean minimal style */
          .product-card-minimal {
            text-decoration: none;
            color: inherit;
            display: block;
            transition: transform 0.3s ease;
          }
          
          .product-card-minimal:hover {
            transform: translateY(-3px);
          }
          
          .product-img-wrap {
            position: relative;
            margin-bottom: 0.75rem;
            aspect-ratio: 1/1;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .product-img-wrap img {
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: transform 0.4s ease;
          }
          
          .product-card-minimal:hover .product-img-wrap img {
            transform: scale(1.03);
          }
          
          .product-card-details {
            text-align: center;
          }
          
          .product-card-name {
            font-family: var(--font-serif);
            font-size: 0.95rem;
            font-weight: 400;
            margin: 0 0 0.2rem 0;
            color: var(--color-dark);
            line-height: 1.3;
          }
          
          .product-card-price {
            font-family: var(--font-sans);
            font-size: 0.8rem;
            font-weight: 300;
            color: var(--color-muted);
          }
          
          /* Load More Button */
          .products-load-more {
            text-align: center;
            margin-top: 2.5rem;
          }
          
          .load-more-btn {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--color-dark);
            background: transparent;
            border: 1px solid var(--color-dark);
            padding: 0.8rem 2.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
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
              padding: 3rem 4%;
            }
            
            .products-grid-compact {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.25rem 0.75rem;
            }
          }
          
          @media (max-width: 480px) {
            .products-section-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
            }
          }

          /* ===== CRAFTSMANSHIP SECTION ===== */
          .craftsmanship-editorial {
            padding: 12rem 0;
            background: var(--color-light);
            position: relative;
          }
          
          .craftsmanship-editorial::before {
            content: '03';
            position: absolute;
            top: 4rem;
            left: 8%;
            font-family: var(--font-serif);
            font-size: 0.9rem;
            color: var(--color-accent);
            letter-spacing: 0.1em;
          }
          
          .craftsmanship-layout {
            display: grid;
            grid-template-columns: 45% 55%;
            min-height: 80vh;
          }
          
          .craftsmanship-content {
            padding: 6rem 5rem 6rem 8%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .craftsmanship-title {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 4vw, 3.5rem);
            font-weight: 300;
            line-height: 1.15;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
          }
          
          .craftsmanship-text {
            font-family: var(--font-sans);
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.9;
            color: var(--color-muted);
            max-width: 420px;
            margin-bottom: 3rem;
          }
          
          .craftsmanship-stats {
            display: flex;
            gap: 4rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0,0,0,0.1);
          }
          
          .stat-item {
            text-align: left;
          }
          
          .stat-number {
            font-family: var(--font-serif);
            font-size: 3rem;
            font-weight: 300;
            color: var(--color-dark);
            line-height: 1;
            margin-bottom: 0.5rem;
          }
          
          .stat-label {
            font-family: var(--font-sans);
            font-size: 0.75rem;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--color-muted);
          }
          
          .craftsmanship-gallery {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 1rem;
            padding: 2rem;
          }
          
          .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          
          .gallery-image-wrapper {
            overflow: hidden;
          }
          
          .gallery-image-wrapper:hover .gallery-image {
            transform: scale(1.02);
          }

          /* ===== COLLECTION BANNER ===== */
          .collection-banner {
            position: relative;
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            background: #1a1a1a;
          }
          
          .collection-banner-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.35;
          }
          
          .collection-banner::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(26, 26, 26, 0.2) 0%,
              rgba(26, 26, 26, 0.4) 50%,
              rgba(26, 26, 26, 0.2) 100%
            );
            z-index: 1;
          }
          
          .collection-banner-content {
            position: relative;
            z-index: 2;
            color: white;
            max-width: 600px;
            padding: 2rem;
          }
          
          .collection-banner-eyebrow {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: var(--color-accent);
            margin-bottom: 1.5rem;
          }
          
          .collection-banner-title {
            font-family: var(--font-serif);
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 300;
            line-height: 1.1;
            margin: 0 0 1.5rem 0;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
          }
          
          .collection-banner-text {
            font-family: var(--font-sans);
            font-size: 1rem;
            font-weight: 300;
            line-height: 1.7;
            opacity: 0.95;
            margin-bottom: 2rem;
            text-shadow: 0 1px 10px rgba(0,0,0,0.2);
          }
          
          .collection-banner-cta {
            display: inline-block;
            font-family: var(--font-sans);
            font-size: 0.8rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: white;
            text-decoration: none;
            padding: 1rem 2.5rem;
            border: 1px solid rgba(255,255,255,0.8);
            transition: all 0.3s ease;
            background: rgba(0,0,0,0.2);
          }
          
          .collection-banner-cta:hover {
            background: white;
            color: var(--color-dark);
            border-color: white;
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 900px) {
            .hero-editorial {
              height: auto;
              min-height: auto;
              max-height: none;
            }
            
            .hero-content {
              position: relative;
              width: 100%;
              padding: 3rem 2rem;
              background: var(--color-light);
            }
            
            .hero-image-container {
              position: relative;
              width: 100%;
              height: 50vh;
              min-height: 300px;
            }
            
            .hero-scroll-indicator {
              display: none;
            }
            
            .philosophy-section {
              grid-template-columns: 1fr;
              gap: 4rem;
              padding: 6rem 2rem;
            }
            
            .philosophy-section::before {
              left: 2rem;
            }
            
            .philosophy-images {
              order: -1;
            }
            
            .products-editorial {
              padding: 6rem 2rem;
            }
            
            .products-editorial::before {
              left: 2rem;
            }
            
            .products-grid-editorial {
              grid-template-columns: repeat(2, 1fr);
              gap: 2rem 1.5rem;
            }
            
            .craftsmanship-layout {
              grid-template-columns: 1fr;
            }
            
            .craftsmanship-content {
              padding: 6rem 2rem;
            }
            
            .craftsmanship-editorial::before {
              left: 2rem;
            }
            
            .craftsmanship-gallery {
              height: 50vh;
            }
          }
          
          @media (max-width: 640px) {
            .philosophy-features {
              grid-template-columns: 1fr;
            }
            
            .philosophy-images {
              grid-template-columns: 1fr;
            }
            
            .philosophy-img:last-child {
              margin-bottom: 0;
            }
            
            .products-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1.5rem;
            }
            
            .craftsmanship-stats {
              flex-direction: column;
              gap: 2rem;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .hero-eyebrow,
            .hero-title,
            .hero-subtitle,
            .hero-cta,
            .hero-image,
            .hero-scroll-indicator {
              animation: none;
              opacity: 1;
            }
          }
        `}
      </style>

      <HeroEditorial />
      <PhilosophySection />
      <ProductsSection collections={data.collectionsWithProducts} />
      <CraftsmanshipSection />
      {data.featuredCollection && (
        <CollectionBanner collection={data.featuredCollection} />
      )}
    </div>
  );
}

function HeroEditorial() {
  return (
    <section className="hero-editorial">
      <div className="hero-content">
        <span className="hero-eyebrow">Artisan Marble Since 2020</span>
        <h1 className="hero-title">
          Where Nature<br />
          Meets <em>Artistry</em>
        </h1>
        <p className="hero-subtitle">
          Bespoke marble pieces crafted for the world's most discerning 
          interiors. Each creation, a testament to geological wonder and 
          human precision.
        </p>
        <Link to="/collections/all" className="hero-cta">
          <span>Explore the Collection</span>
          <svg className="hero-cta-arrow" width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M0 5h18M14 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </Link>
        
        <div className="hero-scroll-indicator">
          <span className="hero-scroll-text">Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </div>
      
      <div className="hero-image-container">
        <img
          className="hero-image"
          src="/landing-page-kitchen.png"
          alt="Luxury Marble Kitchen"
        />
        <div className="hero-image-overlay"></div>
      </div>
    </section>
  );
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

function CollectionBanner({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  
  return (
    <section className="collection-banner">
      {image && (
        <Image 
          className="collection-banner-image"
          data={image} 
          sizes="100vw" 
        />
      )}
      <div className="collection-banner-content">
        <span className="collection-banner-eyebrow">Featured Collection</span>
        <h2 className="collection-banner-title">{collection.title}</h2>
        <p className="collection-banner-text">
          Discover our signature pieces, each hand-selected for their 
          exceptional character and timeless appeal.
        </p>
        <Link 
          to={`/collections/${collection.handle}`} 
          className="collection-banner-cta"
        >
          Explore Collection
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

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

