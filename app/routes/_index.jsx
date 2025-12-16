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
          

          /* ===== HERO SECTION ===== */
          .hero-full {
            display: flex;
            flex-direction: column;
            margin-top: -1.5rem;
          }
          
          .hero-image-full {
            width: 100%;
            height: calc(100vh - 250px);
            min-height: 320px;
            max-height: 600px;
            object-fit: cover;
            object-position: center 35%;
          }
          
          .hero-content-strip {
            padding: 1.25rem 6%;
            background: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
            border-bottom: 1px solid #eee;
          }
          
          .hero-text-group {
            flex: 1;
          }
          
          .hero-title {
            font-family: var(--font-serif);
            font-size: 1.6rem;
            font-weight: 400;
            line-height: 1.3;
            color: var(--color-dark);
            margin: 0 0 0.3rem 0;
          }
          
          .hero-subtitle {
            font-family: var(--font-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: var(--color-muted);
            margin: 0;
          }
          
          .hero-cta {
            flex-shrink: 0;
            font-family: var(--font-serif);
            font-size: 0.95rem;
            color: var(--color-dark);
            text-decoration: none;
            padding: 0.75rem 1.75rem;
            border: 1px solid var(--color-dark);
            transition: all 0.3s ease;
            white-space: nowrap;
          }
          
          .hero-cta:hover {
            background: var(--color-dark);
            color: white;
          }

          /* ===== PHILOSOPHY SECTION ===== */
          .philosophy-section {
            padding: 5rem 6%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
            background: white;
            position: relative;
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
            font-family: var(--font-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.8;
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
            font-family: var(--font-serif);
            font-size: 0.9rem;
            font-weight: 400;
            color: var(--color-muted);
            line-height: 1.5;
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
            font-family: var(--font-serif);
            font-size: 0.9rem;
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
            padding: 0 0.5rem;
          }
          
          .product-card-name {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            font-weight: 500;
            margin: 0 0 0.35rem 0;
            color: var(--color-dark);
            line-height: 1.35;
          }
          
          .product-card-price {
            font-family: var(--font-serif);
            font-size: 1rem;
            font-weight: 400;
            color: #444;
          }
          
          /* Override Hydrogen Money component styles */
          .product-card-price span,
          .product-card-price div,
          .product-card-price * {
            font-family: var(--font-serif) !important;
            font-size: inherit !important;
            font-weight: inherit !important;
          }
          
          /* Load More Button */
          .products-load-more {
            text-align: center;
            margin-top: 2.5rem;
          }
          
          .load-more-btn {
            font-family: var(--font-serif);
            font-size: 0.9rem;
            color: var(--color-dark);
            background: transparent;
            border: 1px solid var(--color-dark);
            padding: 0.75rem 2rem;
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
            padding: 5rem 0;
            background: var(--color-light);
            position: relative;
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
            font-family: var(--font-serif);
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.8;
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
            font-family: var(--font-serif);
            font-size: 0.85rem;
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

          /* ===== FEATURED COLLECTION SHOWCASE ===== */
          .featured-showcase {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 85vh;
            background: linear-gradient(135deg, #f8f5f0 0%, #efe9e1 50%, #e8dfd4 100%);
            overflow: hidden;
          }
          
          /* Decorative background elements */
          .featured-showcase::before {
            content: '';
            position: absolute;
            top: -20%;
            right: -10%;
            width: 60%;
            height: 140%;
            background: radial-gradient(ellipse at center, rgba(139, 115, 85, 0.08) 0%, transparent 70%);
            pointer-events: none;
          }
          
          .featured-showcase::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 115, 85, 0.2), transparent);
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
            max-width: 500px;
            aspect-ratio: 4/5;
          }
          
          /* Decorative frame behind image */
          .featured-showcase-img-frame::before {
            content: '';
            position: absolute;
            top: -20px;
            left: -20px;
            right: 20px;
            bottom: 20px;
            border: 1px solid rgba(139, 115, 85, 0.3);
            z-index: 0;
          }
          
          /* Accent corner decoration */
          .featured-showcase-img-frame::after {
            content: '';
            position: absolute;
            bottom: -30px;
            right: -30px;
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, transparent 50%, rgba(139, 115, 85, 0.15) 50%);
            z-index: 0;
          }
          
          .featured-showcase-img {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            object-fit: cover;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
          }
          
          /* Floating badge */
          .featured-showcase-badge {
            position: absolute;
            top: 2rem;
            left: 2rem;
            z-index: 2;
            background: var(--color-dark);
            color: white;
            padding: 0.75rem 1.25rem;
            font-family: var(--font-sans);
            font-size: 0.7rem;
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
            width: 3px;
            height: 120px;
            background: linear-gradient(to bottom, transparent, var(--color-accent), transparent);
          }
          
          .featured-showcase-label {
            font-family: var(--font-sans);
            font-size: 0.75rem;
            font-weight: 400;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--color-accent);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .featured-showcase-label::before {
            content: '';
            width: 30px;
            height: 1px;
            background: var(--color-accent);
          }
          
          .featured-showcase-title {
            font-family: var(--font-serif);
            font-size: clamp(3rem, 5vw, 4.5rem);
            font-weight: 300;
            line-height: 1.05;
            color: var(--color-dark);
            margin: 0 0 2rem 0;
            letter-spacing: -0.02em;
          }
          
          .featured-showcase-description {
            font-family: var(--font-serif);
            font-size: 1.1rem;
            font-weight: 400;
            line-height: 1.8;
            color: var(--color-muted);
            max-width: 420px;
            margin-bottom: 3rem;
          }
          
          /* Stats row */
          .featured-showcase-meta {
            display: flex;
            gap: 3rem;
            margin-bottom: 3rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(0, 0, 0, 0.08);
          }
          
          .featured-showcase-stat {
            text-align: left;
          }
          
          .featured-showcase-stat-value {
            font-family: var(--font-serif);
            font-size: 2rem;
            font-weight: 300;
            color: var(--color-dark);
            line-height: 1;
            margin-bottom: 0.35rem;
          }
          
          .featured-showcase-stat-label {
            font-family: var(--font-sans);
            font-size: 0.7rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--color-muted);
          }
          
          /* CTA Button */
          .featured-showcase-cta {
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            font-family: var(--font-serif);
            font-size: 1rem;
            color: var(--color-dark);
            text-decoration: none;
            padding: 1rem 2rem;
            background: transparent;
            border: 1px solid var(--color-dark);
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
            background: var(--color-dark);
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
          }
          
          .featured-showcase-cta:hover {
            color: white;
          }
          
          .featured-showcase-cta:hover::before {
            transform: translateX(0);
          }
          
          .featured-showcase-cta-arrow {
            transition: transform 0.3s ease;
          }
          
          .featured-showcase-cta:hover .featured-showcase-cta-arrow {
            transform: translateX(5px);
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
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
          }
          
          @keyframes marble-shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .featured-showcase-img-frame.no-image::before {
            border-color: rgba(139, 115, 85, 0.2);
          }
          
          .placeholder-icon {
            font-family: var(--font-serif);
            font-size: 4rem;
            color: var(--color-accent);
            opacity: 0.6;
            margin-bottom: 1rem;
          }
          
          .placeholder-text {
            font-family: var(--font-serif);
            font-size: 1.5rem;
            font-weight: 300;
            color: var(--color-dark);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            opacity: 0.7;
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
              max-width: 400px;
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
              gap: 1.5rem;
            }
            
            .featured-showcase-img-frame::before,
            .featured-showcase-img-frame::after {
              display: none;
            }
          }

          /* ===== RESPONSIVE ===== */
          @media (max-width: 900px) {
            .hero-image-full {
              height: 45vh;
              min-height: 250px;
              max-height: 400px;
            }
            
            .hero-content-strip {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
              padding: 1.25rem 4%;
            }
            
            .hero-title {
              font-size: 1.4rem;
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

      <HeroSection />
      <PhilosophySection />
      <ProductsSection collections={data.collectionsWithProducts} />
      {data.featuredCollection && (
        <FeaturedShowcase collection={data.featuredCollection} />
      )}
      <CraftsmanshipSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero-full">
      <img
        className="hero-image-full"
        src="/landing-page-kitchen.png"
        alt="Luxury Marble Kitchen"
      />
      <div className="hero-content-strip">
        <div className="hero-text-group">
          <h1 className="hero-title">Artisan Marble for Discerning Spaces</h1>
          <p className="hero-subtitle">
            Handcrafted pieces that celebrate the natural beauty of stone.
          </p>
        </div>
        <Link to="/collections/all" className="hero-cta">
          Shop Collection
        </Link>
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

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */

