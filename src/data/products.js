// Tab keys line up by index with the labels below.
export const tabs = [
  { key: 'new', label: 'New Arrival' },
  { key: 'best', label: 'Bestseller' },
  { key: 'featured', label: 'Featured Products' },
]

export const categories = [
  'Phones',
  'Smart Watches',
  'Cameras',
  'Headphones',
  'Computers',
  'Gaming',
]

// Master catalog. `tabs` lists which tab(s) a product belongs to,
// `category` matches the Browse-By-Category labels above.
// The eight `new` items reproduce the mockup's "New Arrival" grid exactly.
export const catalog = [
  {
    name: 'Apple iPhone 14 Pro Max 128GB Deep Purple (MQ9T3RX/A)',
    price: '$900',
    image: '/imgs/iphone-purple.png',
    category: 'Phones',
    tabs: ['new'],
    diagonal: '6.3"–6.7"', screen: 'OLED', memory: '128 GB', battery: '4000 mAh', protection: 'IP68',
  },
  {
    name: 'Blackmagic Pocket Cinema Camera 6k',
    price: '$2535',
    image: '/imgs/camera.png',
    category: 'Cameras',
    tabs: ['new', 'featured'],
    memory: '512 GB',
  },
  {
    name: 'Apple Watch Series 9 GPS 41mm Starlight Aluminium Case',
    price: '$399',
    image: '/imgs/watch-apple.png',
    category: 'Smart Watches',
    tabs: ['new', 'featured'],
    diagonal: 'Up to 5.5"', screen: 'OLED', memory: '64 GB', protection: 'IP68',
  },
  {
    name: 'AirPods Max Silver',
    price: '$549',
    image: '/imgs/airpods-card.png',
    category: 'Headphones',
    tabs: ['new', 'best'],
  },
  {
    name: 'Samsung Galaxy Watch6 Classic 47mm Black',
    price: '$369',
    image: '/imgs/watch-samsung.png',
    category: 'Smart Watches',
    tabs: ['new'],
    diagonal: 'Up to 5.5"', screen: 'AMOLED', memory: '64 GB', protection: 'IP68',
  },
  {
    name: 'Galaxy Z Fold5 Unlocked | 256GB | Phantom Black',
    price: '$1799',
    image: '/imgs/galaxy-fold.png',
    category: 'Phones',
    tabs: ['new', 'featured'],
    favorite: true,
    diagonal: '6.8"+', screen: 'Super AMOLED', memory: '256 GB', battery: '4000 mAh', protection: 'IP68',
  },
  {
    name: 'Galaxy Buds FE Graphite',
    price: '$99.99',
    image: '/imgs/galaxy-buds.png',
    category: 'Headphones',
    tabs: ['new'],
    protection: 'IP67',
  },
  {
    name: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
    price: '$398',
    image: '/imgs/ipad.png',
    category: 'Computers',
    tabs: ['new', 'best'],
    diagonal: '6.8"+', screen: 'Retina', memory: '64 GB', battery: '5000 mAh', protection: 'IP67',
  },
  // Extra catalog products (surface on Bestseller / Featured and via categories)
  {
    name: 'Sony PlayStation 5',
    price: '$499',
    image: '/imgs/playstation.png',
    category: 'Gaming',
    tabs: ['best', 'featured'],
    memory: '1 TB',
  },
  {
    name: 'Apple MacBook Pro 14" M2',
    price: '$1299',
    image: '/imgs/macbook.png',
    category: 'Computers',
    tabs: ['best', 'featured'],
    diagonal: '6.8"+', screen: 'Retina', memory: '512 GB', battery: '6000+ mAh',
  },
  {
    name: 'Apple Vision Pro',
    price: '$3499',
    image: '/imgs/vision-pro.png',
    category: 'Gaming',
    tabs: ['best', 'featured'],
    screen: 'OLED', memory: '256 GB', battery: '4000 mAh',
  },
  {
    name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)',
    price: '$1437',
    image: '/imgs/iphone-purple.png',
    category: 'Phones',
    tabs: ['best'],
    diagonal: '6.3"–6.7"', screen: 'OLED', memory: '512 GB', battery: '4000 mAh', protection: 'IP68',
  },
]

export const discounts = [
  { name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)', price: '$1437', image: '/imgs/iphone-purple.png' },
  { name: 'AirPods Max Silver', price: '$549', image: '/imgs/airpods-card.png' },
  { name: 'Apple Watch Series 9 GPS 41mm Starlight Aluminium Case', price: '$399', image: '/imgs/watch-apple.png' },
  { name: 'Apple iPhone 14 Pro 1TB Gold (MQ2V3)', price: '$1499', image: '/imgs/iphone-purple.png' },
]
