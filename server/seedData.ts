import { Category, Product, Review, User, Coupon, Address, Order } from '../src/types.js';
import bcrypt from 'bcryptjs';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-dresses',
    name: 'Dresses',
    slug: 'dresses',
    description: 'Effortless silhouettes from draped evening gowns to breezy day dresses.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
    itemCount: 10,
    gender: 'women',
    featured: true
  },
  {
    id: 'cat-outerwear',
    name: 'Outerwear & Blazers',
    slug: 'outerwear',
    description: 'Impeccably tailored double-breasted blazers, cashmere coats, and structured jackets.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80',
    itemCount: 8,
    gender: 'unisex',
    featured: true
  },
  {
    id: 'cat-tops',
    name: 'Tops & Shirts',
    slug: 'tops',
    description: 'Pure silk button-ups, organic cotton poplins, and fluid drape blouses.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    itemCount: 8,
    gender: 'unisex',
    featured: true
  },
  {
    id: 'cat-bottoms',
    name: 'Trousers & Pants',
    slug: 'bottoms',
    description: 'High-waisted tailored pleats, wide-leg linen trousers, and modern cigarette cuts.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
    itemCount: 6,
    gender: 'unisex',
    featured: true
  },
  {
    id: 'cat-skirts',
    name: 'Skirts & Co-Ords',
    slug: 'skirts',
    description: 'Fluid bias-cut satin skirts, knitted sets, and tailored statement coordinates.',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
    itemCount: 5,
    gender: 'women',
    featured: true
  },
  {
    id: 'cat-men',
    name: 'Men’s Collection',
    slug: 'men',
    description: 'Contemporary menswear defined by refined craftsmanship and timeless ease.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80',
    itemCount: 8,
    gender: 'men',
    featured: true
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Artisanal leather goods, sculptural jewelry, and lightweight cashmere essentials.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
    itemCount: 6,
    gender: 'unisex',
    featured: true
  },
  {
    id: 'cat-new-season',
    name: 'New Season Edit',
    slug: 'new-season',
    description: 'Curated capsule wardrobes designed with contemporary architectural lines.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
    itemCount: 12,
    gender: 'unisex',
    featured: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Satin Draped Evening Dress',
    slug: 'satin-draped-evening-dress',
    description: 'Designed with a fluid satin finish and an elegant cowl drape neckline, this evening dress brings effortless sophistication to high-profile occasions. Features an alluring low back and subtle side slit.',
    shortDescription: 'Fluid heavy satin with cowl neckline and elegant side slit.',
    categoryId: 'cat-dresses',
    categoryName: 'Dresses',
    brand: 'LUXORA Atelier',
    price: 2499,
    originalPrice: 3999,
    discount: 37,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Burgundy Wine', hex: '#6D212F' },
      { name: 'Champagne Ivory', hex: '#EFE8DC' },
      { name: 'Midnight Black', hex: '#121214' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 24,
    rating: 4.9,
    reviewCount: 48,
    salesCount: 182,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '100% Premium Mulberry Silk Satin blend',
      'Bias cut for natural contour and flattering drape',
      'Hidden invisible zip closure at side seam',
      'Floor grazing length with graceful flare'
    ],
    care: ['Dry clean only', 'Cool iron on reverse side with cloth', 'Do not tumble dry'],
    material: 'Heavy Mulberry Silk Satin',
    createdAt: new Date('2026-08-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Oversized Tailored Wool Blazer',
    slug: 'oversized-tailored-wool-blazer',
    description: 'A modern wardrobe cornerstone. Structured strong shoulders meet a relaxed, boxy silhouette in pure Italian wool blend. Detailed with horn buttons and peak lapels.',
    shortDescription: 'Structured peak lapel blazer in rich textured wool blend.',
    categoryId: 'cat-outerwear',
    categoryName: 'Outerwear & Blazers',
    brand: 'LUXORA Sartorial',
    price: 4999,
    originalPrice: 6999,
    discount: 28,
    gender: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#D8CEBE' },
      { name: 'Charcoal Black', hex: '#232325' },
      { name: 'Chocolate Brown', hex: '#4A3728' }
    ],
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 18,
    rating: 4.8,
    reviewCount: 36,
    salesCount: 145,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '80% Virgin Wool, 20% Cashmere',
      'Full cupro cupro lining for smooth layering',
      'Double-breasted front with real horn buttons',
      'Internal jet pockets and deep front flap pockets'
    ],
    care: ['Specialist dry clean', 'Steam gently when required'],
    material: 'Virgin Wool & Cashmere',
    createdAt: new Date('2026-07-20').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Pleated High-Waisted Palazzo Trousers',
    slug: 'pleated-high-waisted-palazzo-trousers',
    description: 'Sculptural elegance in every step. Featuring deep front double pleats, clean waistband with hidden hook-and-bar fastening, and wide fluid legs that lengthen the frame.',
    shortDescription: 'Architectural front pleats with flowing wide-leg silhouette.',
    categoryId: 'cat-bottoms',
    categoryName: 'Trousers & Pants',
    brand: 'LUXORA Atelier',
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory Cream', hex: '#F4EFE6' },
      { name: 'Olive Sage', hex: '#5A6351' },
      { name: 'Noir Black', hex: '#161616' }
    ],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 30,
    rating: 4.7,
    reviewCount: 29,
    salesCount: 110,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: true,
    isFeatured: false,
    details: [
      'Crisp heavyweight TENCEL™ lyocell blend',
      'Double front pleats with rear waist darts',
      'Side slant pockets and faux rear welt pockets',
      'Full floor length with generous hem allowance'
    ],
    care: ['Machine wash cold on gentle cycle', 'Hang dry in shade', 'Warm iron'],
    material: 'TENCEL™ Lyocell & Viscose',
    createdAt: new Date('2026-08-01').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Pure Mulberry Silk Wrap Blouse',
    slug: 'pure-mulberry-silk-wrap-blouse',
    description: 'An ethereal blouse crafted from luxurious sand-washed mulberry silk. Designed with a crossover wrap silhouette, self-tie sash at waist, and delicate French seams.',
    shortDescription: 'Sand-washed silk wrap top with tailored French cuffs.',
    categoryId: 'cat-tops',
    categoryName: 'Tops & Shirts',
    brand: 'LUXORA Atelier',
    price: 3299,
    originalPrice: 4599,
    discount: 28,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blush Rose', hex: '#DDB6B6' },
      { name: 'Champagne', hex: '#EBE2D0' },
      { name: 'Deep Navy', hex: '#1B263B' }
    ],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 15,
    rating: 4.9,
    reviewCount: 21,
    salesCount: 92,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Grade 6A Mulberry Silk (19mm)',
      'Adjustable wrap front with extended waist sash',
      'Mother-of-pearl buttons on wide cuffs',
      'Sand-washed finish with matte suede touch'
    ],
    care: ['Hand wash cold with silk detergent', 'Lay flat to dry'],
    material: '100% Grade 6A Mulberry Silk',
    createdAt: new Date('2026-08-20').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Emerald Green Silk Slip Dress',
    slug: 'emerald-green-silk-slip-dress',
    description: 'Cut on the bias to follow every curve gracefully. Features adjustable delicate spaghetti straps, scoop neckline, and a subtle fluted hem that ripples with every motion.',
    shortDescription: 'Classic 90s bias-cut silk slip dress in rich emerald.',
    categoryId: 'cat-dresses',
    categoryName: 'Dresses',
    brand: 'LUXORA Atelier',
    price: 2799,
    originalPrice: 4299,
    discount: 35,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Gem', hex: '#1E4D38' },
      { name: 'Copper Rust', hex: '#9C4F35' },
      { name: 'Classic Black', hex: '#141416' }
    ],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 20,
    rating: 4.8,
    reviewCount: 34,
    salesCount: 160,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      'Heavyweight 22mm silk charmeuse',
      'Bias cut for fluid, body-skimming contour',
      'Micro-adjustable slider straps',
      'Midi length hitting mid-calf'
    ],
    care: ['Dry clean or delicate cold hand wash', 'Iron with damp cloth'],
    material: 'Silk Charmeuse',
    createdAt: new Date('2026-07-10').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Italian Linen Relaxed Resort Shirt',
    slug: 'italian-linen-relaxed-resort-shirt',
    description: 'Crafted from breathable Normandy linen woven in Northern Italy. Designed with a relaxed camp collar, mother-of-pearl buttons, and clean side split vents.',
    shortDescription: 'Premium washed Italian linen with relaxed open camp collar.',
    categoryId: 'cat-men',
    categoryName: 'Men’s Collection',
    brand: 'LUXORA Uomo',
    price: 1899,
    originalPrice: 2899,
    discount: 34,
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Warm Ecru', hex: '#EDE6D8' },
      { name: 'Aegean Blue', hex: '#3E5879' },
      { name: 'Olive Green', hex: '#525B44' }
    ],
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 25,
    rating: 4.8,
    reviewCount: 19,
    salesCount: 88,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Certified European Flax® Linen',
      'Garment washed for ultra-soft lived-in texture',
      'Convertible open camp collar',
      'Straight hem with side slits for untucked ease'
    ],
    care: ['Machine wash warm', 'Do not bleach', 'Iron while damp for crisp finish'],
    material: '100% Normandy Linen',
    createdAt: new Date('2026-08-18').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Ribbed Knit Cashmere Bodycon Dress',
    slug: 'ribbed-knit-cashmere-bodycon-dress',
    description: 'Knitted from ultra-fine Mongolian cashmere and organic cotton. Contours the body without restricting, featuring a chic mock-neck and long bell sleeves with slit details.',
    shortDescription: 'Buttery soft ribbed cashmere blend with mock collar.',
    categoryId: 'cat-dresses',
    categoryName: 'Dresses',
    brand: 'LUXORA Studio',
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Camel Tan', hex: '#C29B70' },
      { name: 'Rich Espresso', hex: '#3B2F2F' },
      { name: 'Cream Chalk', hex: '#F7F4EE' }
    ],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 16,
    rating: 4.9,
    reviewCount: 27,
    salesCount: 135,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '30% Cashmere, 70% Extra-fine Organic Cotton',
      'Ribbed knit engineered with memory stretch',
      'Subtle thumbholes and slit cuffs',
      'Midi hem with rear walking vent'
    ],
    care: ['Hand wash cold with wool wash', 'Dry flat on towel', 'Store folded'],
    material: 'Cashmere & Organic Cotton',
    createdAt: new Date('2026-08-22').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Structured Leather Trapezoid Tote',
    slug: 'structured-leather-trapezoid-tote',
    description: 'Handcrafted by Italian artisans in smooth calfskin leather. Features geometric sculptural lines, magnetic flap clasp, dual rolled top handles, and detachable shoulder strap.',
    shortDescription: 'Full-grain Italian calfskin with gold hardware accent.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    brand: 'LUXORA Pelletteria',
    price: 3499,
    originalPrice: 5299,
    discount: 34,
    gender: 'unisex',
    sizes: ['One Size'],
    colors: [
      { name: 'Cognac Leather', hex: '#8B4513' },
      { name: 'Onyx Black', hex: '#1C1C1E' },
      { name: 'Taupe Mist', hex: '#9E9489' }
    ],
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 12,
    rating: 5.0,
    reviewCount: 15,
    salesCount: 74,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '100% Full-grain vegetable tanned Italian leather',
      'Brushed 24k gold-plated brass hardware',
      'Suede interior lining with zippered security compartment',
      'Protective metal feet at base'
    ],
    care: ['Protect from direct moisture', 'Use specialist leather conditioner annually'],
    material: 'Full-Grain Italian Leather',
    createdAt: new Date('2026-07-05').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Double-Breasted Trench Coat with Storm Flap',
    slug: 'double-breasted-trench-coat-with-storm-flap',
    description: 'An iconic silhouette reinterpreted with minimalist proportions. Water-resistant dense cotton gabardine with epaulettes, deep storm shield, and belted waist.',
    shortDescription: 'Water-resistant cotton gabardine with horn buckle belt.',
    categoryId: 'cat-outerwear',
    categoryName: 'Outerwear & Blazers',
    brand: 'LUXORA Sartorial',
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    gender: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Classic Khaki', hex: '#C3B091' },
      { name: 'Midnight Charcoal', hex: '#2A2D34' }
    ],
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 14,
    rating: 4.8,
    reviewCount: 22,
    salesCount: 68,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Compact Cotton Gabardine (Water Repellent)',
      'Raglan sleeve construction for effortless layering',
      'Detachable self-tie waist belt with D-rings',
      'Deep welt storm pockets and throat latch'
    ],
    care: ['Specialist dry clean only'],
    material: 'Water-Repellent Cotton Gabardine',
    createdAt: new Date('2026-08-14').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'Bias-Cut Satin Midi Skirt',
    slug: 'bias-cut-satin-midi-skirt',
    description: 'The ultimate versatile piece that transitions seamlessly from day to evening. Fitted at the high waist with hidden elastic band, flowing into a gentle A-line flare.',
    shortDescription: 'Heavyweight silky satin skirt with flattering fluid movement.',
    categoryId: 'cat-skirts',
    categoryName: 'Skirts & Co-Ords',
    brand: 'LUXORA Studio',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Mocha Bronze', hex: '#7E5835' },
      { name: 'Oyster Pearl', hex: '#EAE6DF' },
      { name: 'Forest Noir', hex: '#1D2A24' }
    ],
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 22,
    rating: 4.7,
    reviewCount: 31,
    salesCount: 140,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: false,
    details: [
      'Smooth high-density satin blend',
      'Concealed elastic waistband sits flat',
      'True bias cut ensures fluid drape',
      'Hits at mid-calf'
    ],
    care: ['Gentle machine wash cold in mesh bag', 'Hang dry'],
    material: 'High-Density Satin Blend',
    createdAt: new Date('2026-07-28').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'Tailored Gurkha Chino Trousers',
    slug: 'tailored-gurkha-chino-trousers',
    description: 'Inspired by traditional British tailoring with distinct cross-over double buckle waistband. Made in compact cotton twill with deep forward pleats.',
    shortDescription: 'Classic double buckle waistband with tailored pleats.',
    categoryId: 'cat-men',
    categoryName: 'Men’s Collection',
    brand: 'LUXORA Uomo',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    gender: 'men',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'British Tan', hex: '#9C7A4C' },
      { name: 'Navy Blue', hex: '#1E293B' },
      { name: 'Stone Grey', hex: '#878787' }
    ],
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 19,
    rating: 4.9,
    reviewCount: 18,
    salesCount: 65,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Mercerized Long-Staple Cotton Twill',
      'Adjustable side buckles with solid brass hardware',
      'Extended waistband clasp eliminates need for belt',
      'Cuffed 2-inch hem'
    ],
    care: ['Machine wash cold', 'Tumble dry low or line dry'],
    material: '100% Mercerized Cotton Twill',
    createdAt: new Date('2026-08-10').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Floral Print Chiffon Tiered Midi Dress',
    slug: 'floral-print-chiffon-tiered-midi-dress',
    description: 'An airy romantic midi dress with hand-painted botanical motifs. Delicate balloon sleeves, smocked waist for tailored comfort, and tiered cascading ruffles.',
    shortDescription: 'Botanical print silk chiffon with smocked waist and flutter sleeves.',
    categoryId: 'cat-dresses',
    categoryName: 'Dresses',
    brand: 'LUXORA Studio',
    price: 2699,
    originalPrice: 3899,
    discount: 31,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Vintage Rose', hex: '#C48B9F' },
      { name: 'Sage Garden', hex: '#688B73' }
    ],
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 18,
    rating: 4.8,
    reviewCount: 39,
    salesCount: 155,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      'Lightweight breathable Silk Chiffon with soft slip lining',
      'Hand-screened archival floral pattern',
      'Elasticized smocked bodice adapts to shape',
      'Tiered hem with ruffle trim'
    ],
    care: ['Gentle hand wash cold', 'Line dry in shade'],
    material: 'Silk Chiffon with Viscose Lining',
    createdAt: new Date('2026-07-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-13',
    name: 'Sculptural Molten Gold Hoop Earrings',
    slug: 'sculptural-molten-gold-hoop-earrings',
    description: 'Artisanal organic hoops created using lost-wax casting technique. Lightweight hollow construction for all-day comfort with a radiant 18k gold vermeil luster.',
    shortDescription: '18k gold vermeil organic hoops with hypoallergenic titanium posts.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    brand: 'LUXORA Fine Jewelry',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    gender: 'unisex',
    sizes: ['One Size'],
    colors: [
      { name: '18k Yellow Gold', hex: '#E5C158' },
      { name: 'Sterling Silver', hex: '#D1D5DB' }
    ],
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 40,
    rating: 4.9,
    reviewCount: 52,
    salesCount: 220,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: false,
    details: [
      '18k Gold Vermeil over recycled 925 Sterling Silver',
      'Nickel-free & hypoallergenic titanium posts',
      'Diameter: 28mm, Thickness: 4mm',
      'Secure click-latch closure'
    ],
    care: ['Store in anti-tarnish pouch', 'Avoid direct contact with perfumes'],
    material: '18k Gold Vermeil & 925 Silver',
    createdAt: new Date('2026-06-25').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-14',
    name: 'Merino Wool Mock-Neck Knit Jumper',
    slug: 'merino-wool-mock-neck-knit-jumper',
    description: 'Spun from extra-fine Australian Merino wool. Offers supreme thermal regulation, refined seamless construction, and ribbed hem and cuffs.',
    shortDescription: 'Extra-fine 19.5 micron merino wool seamless knit.',
    categoryId: 'cat-tops',
    categoryName: 'Tops & Shirts',
    brand: 'LUXORA Studio',
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    gender: 'unisex',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Alabaster White', hex: '#F2EFE9' },
      { name: 'Espresso Black', hex: '#2B2321' },
      { name: 'Olive Pine', hex: '#3E4739' }
    ],
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 20,
    rating: 4.8,
    reviewCount: 24,
    salesCount: 105,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: false,
    isFeatured: false,
    details: [
      '100% Woolmark-certified Australian Merino Wool',
      'Gauge 14 knit with natural stretch and wrinkle resistance',
      'Mock funnel neck',
      'Naturally odor-resistant and breathable'
    ],
    care: ['Hand wash cold or wool cycle', 'Reshape while damp'],
    material: '100% Australian Merino Wool',
    createdAt: new Date('2026-08-05').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-15',
    name: 'Oversized Poplin Boyfriend Shirt',
    slug: 'oversized-poplin-boyfriend-shirt',
    description: 'Crisp organic cotton poplin crafted with an intentionally relaxed boyfriend fit. Features exaggerated pointed collar, drop shoulders, and mother-of-pearl buttons.',
    shortDescription: 'Architectural oversized poplin shirt in organic long-staple cotton.',
    categoryId: 'cat-tops',
    categoryName: 'Tops & Shirts',
    brand: 'LUXORA Sartorial',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Crisp Optical White', hex: '#FFFFFF' },
      { name: 'Sky Stripe Blue', hex: '#B2CBE4' },
      { name: 'Midnight Charcoal', hex: '#222326' }
    ],
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 35,
    rating: 4.9,
    reviewCount: 42,
    salesCount: 190,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '100% GOTS-Certified Organic Cotton Poplin',
      'Exaggerated curved hem and French cuffs',
      'Box pleat at rear yoke for relaxed drape',
      'Dense 120-thread count weave'
    ],
    care: ['Machine wash warm', 'Warm iron with steam'],
    material: 'Organic Cotton Poplin',
    createdAt: new Date('2026-07-02').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-16',
    name: 'Linen Waistcoat & Bermuda Short Set',
    slug: 'linen-waistcoat-bermuda-short-set',
    description: 'The definitive warm-weather tailored suit. Comprises a fitted button-down vest with pointed hem and matching pleated knee-length Bermuda shorts.',
    shortDescription: 'Two-piece tailored summer co-ord in washed French flax.',
    categoryId: 'cat-skirts',
    categoryName: 'Skirts & Co-Ords',
    brand: 'LUXORA Atelier',
    price: 3599,
    originalPrice: 4999,
    discount: 28,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sandstone Beige', hex: '#D6C7B2' },
      { name: 'Terracotta', hex: '#B85D43' }
    ],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 14,
    rating: 4.8,
    reviewCount: 16,
    salesCount: 78,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Pure French Flax Linen',
      'Includes fitted vest and matching pleated shorts',
      'Adjustable cinched cinch-back on vest',
      'Slant pockets on shorts with belt loops'
    ],
    care: ['Machine wash cold on delicate', 'Hang dry'],
    material: 'French Flax Linen',
    createdAt: new Date('2026-08-12').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-17',
    name: 'Italian Leather Chelsea Boot',
    slug: 'italian-leather-chelsea-boot',
    description: 'Clean minimalist silhouette crafted from polished Tuscan box leather. Features elastic side gussets, Goodyear welted construction, and durable Vibram rubber outsole.',
    shortDescription: 'Goodyear welted Chelsea boots with ergonomic cushioned insole.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    brand: 'LUXORA Calzature',
    price: 4499,
    originalPrice: 6499,
    discount: 31,
    gender: 'unisex',
    sizes: ['38', '39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'Gloss Noir', hex: '#111111' },
      { name: 'Burnished Chestnut', hex: '#522B18' }
    ],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 15,
    rating: 4.9,
    reviewCount: 26,
    salesCount: 95,
    isNewArrival: false,
    isTrending: false,
    isBestSeller: true,
    isFeatured: false,
    details: [
      'Full-grain Italian Tuscan leather upper',
      'Full calfskin leather lining',
      'Goodyear welted construction allows recrafting',
      'Vibram anti-slip rubber lug sole'
    ],
    care: ['Clean with soft brush', 'Treat regularly with beeswax cream'],
    material: 'Full-Grain Tuscan Calfskin',
    createdAt: new Date('2026-07-18').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-18',
    name: 'Cashmere-Blend Minimalist Overcoat',
    slug: 'cashmere-blend-minimalist-overcoat',
    description: 'An architectural single-breasted coat featuring clean concealed button placket, notched lapels, and a sweeping calf-length cut.',
    shortDescription: 'Luxurious double-faced cashmere wool coat with hidden placket.',
    categoryId: 'cat-outerwear',
    categoryName: 'Outerwear & Blazers',
    brand: 'LUXORA Sartorial',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    gender: 'unisex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#B8926A' },
      { name: 'Caviar Black', hex: '#161616' }
    ],
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 10,
    rating: 5.0,
    reviewCount: 14,
    salesCount: 52,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '50% Mongolian Cashmere, 50% Fine Merino Wool',
      'Hand-stitched double-faced craftsmanship',
      'Deep welt storm pockets',
      'Rear center vent for walking mobility'
    ],
    care: ['Professional dry clean only'],
    material: 'Mongolian Cashmere & Merino Wool',
    createdAt: new Date('2026-08-25').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-19',
    name: 'Raw Denim Straight-Leg Selvedge Jeans',
    slug: 'raw-denim-straight-leg-selvedge-jeans',
    description: 'Woven on vintage shuttle looms in Okayama, Japan. 13.5oz red-line selvedge denim that shapes to the wearer over time.',
    shortDescription: '13.5oz Japanese shuttle-loomed selvedge denim with button fly.',
    categoryId: 'cat-bottoms',
    categoryName: 'Trousers & Pants',
    brand: 'LUXORA Denim',
    price: 2799,
    originalPrice: 3999,
    discount: 30,
    gender: 'unisex',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Raw Indigo', hex: '#1C2833' },
      { name: 'Washed Black', hex: '#2C3E50' }
    ],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 22,
    rating: 4.8,
    reviewCount: 30,
    salesCount: 118,
    isNewArrival: false,
    isTrending: false,
    isBestSeller: true,
    isFeatured: false,
    details: [
      '100% Cotton Okayama Selvedge Denim',
      'Solid copper donut buttons and hidden rivets',
      'Chain-stitched hem with red selvedge ID',
      'Classic mid-rise straight leg cut'
    ],
    care: ['Wash sparingly inside out in cold water', 'Hang dry'],
    material: 'Japanese Selvedge Denim',
    createdAt: new Date('2026-06-30').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-20',
    name: 'Suede Minimalist Harrington Jacket',
    slug: 'suede-minimalist-harrington-jacket',
    description: 'Buttery soft goat suede tailored into a timeless bomber jacket. Features two-way matte zipper, stand collar with horn button tabs, and rib-knit cuffs.',
    shortDescription: 'Velvety goat suede with stand collar and two-way zipper.',
    categoryId: 'cat-men',
    categoryName: 'Men’s Collection',
    brand: 'LUXORA Uomo',
    price: 5299,
    originalPrice: 7499,
    discount: 29,
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chestnut Brown', hex: '#633A1F' },
      { name: 'Slate Moss', hex: '#4B5346' }
    ],
    images: [
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 11,
    rating: 4.9,
    reviewCount: 15,
    salesCount: 56,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '100% Premium Goat Suede',
      'Soft cotton chambray body lining',
      'Two-way YKK antique metal zipper',
      'Internal zippered security pocket'
    ],
    care: ['Specialist leather & suede clean only'],
    material: '100% Goat Suede Leather',
    createdAt: new Date('2026-08-08').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-21',
    name: 'Ribbed Knit Square-Neck Crop Top',
    slug: 'ribbed-knit-square-neck-crop-top',
    description: 'Clean architectural lines defined by a dramatic square neckline and thick support straps. Knitted in compact stretch viscose that holds shape perfectly.',
    shortDescription: 'Sculpting square neckline top in dense compact knit.',
    categoryId: 'cat-tops',
    categoryName: 'Tops & Shirts',
    brand: 'LUXORA Studio',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory White', hex: '#F7F6F2' },
      { name: 'Deep Espresso', hex: '#2A1F1D' },
      { name: 'Burgundy', hex: '#6D212F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 30,
    rating: 4.7,
    reviewCount: 38,
    salesCount: 170,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: false,
    details: [
      '72% Viscose, 28% Polybutylene Terephthalate for shape retention',
      'Double knit for complete zero show-through opacity',
      'Wide supportive shoulder straps',
      'Cropped length pairs seamlessly with high-rise trousers'
    ],
    care: ['Machine wash cold gentle', 'Dry flat'],
    material: 'Compact Stretch Viscose',
    createdAt: new Date('2026-07-12').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-22',
    name: 'Tortoiseshell Acetate Oversized Sunglasses',
    slug: 'tortoiseshell-acetate-oversized-sunglasses',
    description: 'Hand-polished Italian Mazzucchelli acetate frames with polarized category 3 lenses. Offers 100% UV400 protection and 7-barrel hinges.',
    shortDescription: 'Mazzucchelli acetate frames with anti-reflective polarized lenses.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    brand: 'LUXORA Ottica',
    price: 1499,
    originalPrice: 2299,
    discount: 35,
    gender: 'unisex',
    sizes: ['One Size'],
    colors: [
      { name: 'Havana Tortoise', hex: '#5D4037' },
      { name: 'Gloss Black', hex: '#111111' }
    ],
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 28,
    rating: 4.8,
    reviewCount: 29,
    salesCount: 130,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    isFeatured: false,
    details: [
      'Handcrafted Italian Mazzucchelli 1849 acetate',
      'Polarized scratch-resistant nylon lenses',
      '100% UV400 protection (UVA & UVB)',
      'Includes hard leather protective case and microfiber cloth'
    ],
    care: ['Rinse with lukewarm water and clean with microfiber'],
    material: 'Italian Mazzucchelli Acetate',
    createdAt: new Date('2026-06-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-23',
    name: 'Cashmere Fringe Wrap Scarf',
    slug: 'cashmere-fringe-wrap-scarf',
    description: 'Woven from ethically sourced Grade-A Inner Mongolian cashmere. Featherlight yet extraordinarily warm, finished with delicate rolled fringe tassels.',
    shortDescription: '100% Grade-A cashmere blanket scarf with hand-twisted fringes.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    brand: 'LUXORA Studio',
    price: 2199,
    originalPrice: 3299,
    discount: 33,
    gender: 'unisex',
    sizes: ['One Size (200x70cm)'],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D8CEBE' },
      { name: 'Dusty Rose', hex: '#C28D8D' },
      { name: 'Burgundy', hex: '#6D212F' }
    ],
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 35,
    rating: 4.9,
    reviewCount: 41,
    salesCount: 175,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: true,
    isFeatured: true,
    details: [
      '100% Grade-A Mongolian Cashmere',
      'Dimensions: 200cm length x 70cm width',
      'Hand-twisted fringed edges',
      'Featherweight 180gsm ripple texture'
    ],
    care: ['Hand wash cold with cashmere wash', 'Dry flat'],
    material: '100% Pure Cashmere',
    createdAt: new Date('2026-08-26').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-24',
    name: 'Off-Shoulder Velvet Cocktail Dress',
    slug: 'off-shoulder-velvet-cocktail-dress',
    description: 'Rich silk-blend velvet that catches the light with understated luxury. Fitted off-shoulder foldover neckline with boned internal corset for supportive drape.',
    shortDescription: 'Silk-blend velvet cocktail dress with structured internal bustier.',
    categoryId: 'cat-dresses',
    categoryName: 'Dresses',
    brand: 'LUXORA Atelier',
    price: 3899,
    originalPrice: 5599,
    discount: 30,
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Burgundy Wine', hex: '#6D212F' },
      { name: 'Midnight Onyx', hex: '#111113' },
      { name: 'Emerald Velvet', hex: '#163E2D' }
    ],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 14,
    rating: 5.0,
    reviewCount: 22,
    salesCount: 88,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    isFeatured: true,
    details: [
      '20% Silk, 80% Rayon Velvet',
      'Lightly boned internal bustier provides lift without straps',
      'Invisible center back zip with hook-and-eye',
      'Hits just below the knee with rear vent'
    ],
    care: ['Professional dry clean only', 'Never iron directly (steam from distance)'],
    material: 'Silk-Blend Velvet',
    createdAt: new Date('2026-08-28').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    maxDiscount: 1000,
    minOrderValue: 1500,
    description: '10% off on your first order over ₹1,500',
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true
  },
  {
    code: 'FASHION20',
    discountPercentage: 20,
    maxDiscount: 2500,
    minOrderValue: 3999,
    description: '20% off on luxury orders over ₹3,999',
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true
  },
  {
    code: 'NEWUSER15',
    discountPercentage: 15,
    maxDiscount: 1500,
    minOrderValue: 2499,
    description: '15% instant discount on orders over ₹2,499',
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true
  },
  {
    code: 'LUXORA500',
    discountPercentage: 12,
    maxDiscount: 500,
    minOrderValue: 2000,
    description: 'Special seasonal treat: 12% off up to ₹500',
    expiresAt: '2027-12-31T23:59:59Z',
    isActive: true
  }
];

export function getInitialSeedData() {
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const customerPasswordHash = bcrypt.hashSync('customer123', 10);

  const users: User[] = [
    {
      id: 'usr-admin-1',
      name: 'Eleanor Vance',
      email: 'admin@luxora.com',
      phone: '+91 98765 43210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-demo-customer',
      name: 'Aria Montgomery',
      email: 'customer@luxora.com',
      phone: '+91 98111 22334',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      createdAt: '2026-05-10T00:00:00.000Z'
    }
  ];

  const credentials: Record<string, string> = {
    'admin@luxora.com': adminPasswordHash,
    'customer@luxora.com': customerPasswordHash
  };

  const addresses: Address[] = [
    {
      id: 'addr-1',
      userId: 'usr-demo-customer',
      fullName: 'Aria Montgomery',
      phoneNumber: '+91 98111 22334',
      addressLine1: 'Penthouse 4B, The Grand Residences',
      addressLine2: 'Road No. 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500033',
      country: 'India',
      type: 'Home',
      isDefault: true
    },
    {
      id: 'addr-2',
      userId: 'usr-demo-customer',
      fullName: 'Aria Montgomery',
      phoneNumber: '+91 98111 22334',
      addressLine1: 'Studio 12, Design Quarters',
      addressLine2: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      type: 'Work',
      isDefault: false
    }
  ];

  const reviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'prod-1',
      userId: 'usr-demo-customer',
      userName: 'Aria Montgomery',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'Breathtaking quality & ethereal drape',
      comment: 'Wore this satin gown to a charity gala and received endless compliments. The fabric has an expensive, weighty handfeel and the burgundy color is rich and luminous.',
      isVerifiedPurchase: true,
      createdAt: '2026-08-20T14:30:00Z',
      likes: 12
    },
    {
      id: 'rev-2',
      productId: 'prod-1',
      userId: 'usr-cust-2',
      userName: 'Camilla Dupont',
      userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'The fit is immaculate',
      comment: 'True to size. The bias cut hugs curves naturally without clinging uncomfortably. Absolute luxury!',
      isVerifiedPurchase: true,
      createdAt: '2026-08-22T09:15:00Z',
      likes: 8
    },
    {
      id: 'rev-3',
      productId: 'prod-2',
      userId: 'usr-demo-customer',
      userName: 'Aria Montgomery',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      title: 'The pinnacle of tailoring',
      comment: 'The shoulders have that sharp, modern architectural silhouette. Looks incredible over a simple slip or with tailored trousers.',
      isVerifiedPurchase: true,
      createdAt: '2026-08-10T16:45:00Z',
      likes: 15
    }
  ];

  const sampleOrder: Order = {
    id: 'ord-lx-1082',
    orderNumber: 'LUX-2026-1082',
    userId: 'usr-demo-customer',
    customerName: 'Aria Montgomery',
    customerEmail: 'customer@luxora.com',
    customerPhone: '+91 98111 22334',
    deliveryAddress: addresses[0],
    items: [
      {
        id: 'ord-item-1',
        productId: 'prod-1',
        productName: 'Satin Draped Evening Dress',
        productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80',
        productSlug: 'satin-draped-evening-dress',
        size: 'S',
        color: 'Burgundy Wine',
        quantity: 1,
        price: 2499,
        originalPrice: 3999
      },
      {
        id: 'ord-item-2',
        productId: 'prod-13',
        productName: 'Sculptural Molten Gold Hoop Earrings',
        productImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=400&q=80',
        productSlug: 'sculptural-molten-gold-hoop-earrings',
        size: 'One Size',
        color: '18k Yellow Gold',
        quantity: 1,
        price: 1299,
        originalPrice: 1999
      }
    ],
    subtotal: 3798,
    discountAmount: 379.8,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    taxAmount: 189.9,
    totalAmount: 3608.1,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    tracking: [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Order details received and verified by system.',
        timestamp: '2026-09-01T09:12:00.000Z',
        completed: true,
        current: false
      },
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        description: 'Payment verified via UPI. Inventory reserved.',
        timestamp: '2026-09-01T09:15:00.000Z',
        completed: true,
        current: false
      },
      {
        status: 'PROCESSING',
        label: 'Processing & Quality Check',
        description: 'Items hand-inspected by LUXORA Atelier quality team.',
        timestamp: '2026-09-01T14:30:00.000Z',
        completed: true,
        current: false
      },
      {
        status: 'PACKED',
        label: 'Packed in Luxury Gift Box',
        description: 'Encased in custom tissue paper and signature black gift box.',
        timestamp: '2026-09-01T18:00:00.000Z',
        completed: true,
        current: false
      },
      {
        status: 'SHIPPED',
        label: 'Shipped with BlueDart Express',
        description: 'Dispatched from LUXORA Central Hub (AWB: BD889104726). In transit.',
        timestamp: '2026-09-02T04:30:00.000Z',
        completed: true,
        current: true,
        location: 'Mumbai Hub Transit Facility'
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Delivery',
        description: 'Courier associate assigned for same-day delivery.',
        timestamp: 'Estimated: 2026-09-03T10:00:00.000Z',
        completed: false,
        current: false
      },
      {
        status: 'DELIVERED',
        label: 'Delivered',
        description: 'Handed over with signature verification.',
        timestamp: 'Estimated: 2026-09-03T14:00:00.000Z',
        completed: false,
        current: false
      }
    ],
    carrierName: 'BlueDart Express Air',
    trackingNumber: 'BD889104726',
    estimatedDelivery: 'September 3, 2026',
    createdAt: '2026-09-01T09:12:00.000Z',
    updatedAt: '2026-09-02T04:30:00.000Z'
  };

  return {
    categories: INITIAL_CATEGORIES,
    products: INITIAL_PRODUCTS,
    coupons: INITIAL_COUPONS,
    users,
    credentials,
    addresses,
    reviews,
    orders: [sampleOrder],
    carts: {} as Record<string, any[]>,
    wishlists: {} as Record<string, string[]>,
    newsletterSubscribers: ['vip-collector@luxora.fashion']
  };
}
