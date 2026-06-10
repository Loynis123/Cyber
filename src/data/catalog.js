// Brand list for the products-page sidebar. Counts are catalog availability
// figures from the design (decorative).
export const brands = [
  { name: 'Apple', count: 110 },
  { name: 'Samsung', count: 125 },
  { name: 'Xiaomi', count: 68 },
  { name: 'Poco', count: 44 },
  { name: 'OPPO', count: 36 },
  { name: 'Honor', count: 10 },
  { name: 'Motorola', count: 34 },
  { name: 'Nokia', count: 22 },
  { name: 'Realme', count: 35 },
  { name: 'Huawei', count: 28 },
]

// Secondary, collapsible filter groups. `prop` maps the group to the product
// field it filters on.
export const filterGroups = [
  { name: 'Battery capacity', prop: 'battery', options: ['3000 mAh', '4000 mAh', '5000 mAh', '6000+ mAh'] },
  { name: 'Screen type', prop: 'screen', options: ['OLED', 'AMOLED', 'Super AMOLED', 'IPS LCD', 'Retina'] },
  { name: 'Screen diagonal', prop: 'diagonal', options: ['Up to 5.5"', '5.6"–6.2"', '6.3"–6.7"', '6.8"+'] },
  { name: 'Protection class', prop: 'protection', options: ['IP67', 'IP68', 'MIL-STD-810'] },
  { name: 'Built-in memory', prop: 'memory', options: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'] },
]

export const sortOptions = [
  'By rating',
  'Price: low to high',
  'Price: high to low',
  'Newest first',
]

// price is numeric for sorting; formatted with $ in the view.
// Only an iPhone cutout was provided, so iPhones reuse one image.
export const productsCatalog = [
  { name: 'Apple iPhone 14 Pro 512GB Gold (MQ233)', price: 1437, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '512 GB' },
  { name: 'Apple iPhone 11 128GB White (MQ233)', price: 510, image: '/imgs/iphone-silver.png', brand: 'Apple', battery: '3000 mAh', screen: 'IPS LCD', diagonal: '5.6"–6.2"', protection: 'IP68', memory: '128 GB' },
  { name: 'Apple iPhone 11 128GB White (MQ233)', price: 550, image: '/imgs/iphone-silver.png', brand: 'Apple', battery: '3000 mAh', screen: 'IPS LCD', diagonal: '5.6"–6.2"', protection: 'IP68', memory: '128 GB' },
  { name: 'Apple iPhone 14 Pro 1TB Gold (MQ2V3)', price: 1499, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '1 TB' },
  { name: 'Apple iPhone 14 Pro 1TB Gold (MQ2V3)', price: 1399, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '1 TB' },
  { name: 'Apple iPhone 14 Pro 128GB Deep Purple (MQ0G3)', price: 1600, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '128 GB' },
  { name: 'Apple iPhone 13 mini 128GB Pink (MLK23)', price: 850, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '3000 mAh', screen: 'OLED', diagonal: 'Up to 5.5"', protection: 'IP68', memory: '128 GB' },
  { name: 'Apple iPhone 14 Pro 256GB Space Black (MQ0T3)', price: 1399, image: '/imgs/iphone-purple.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '256 GB' },
  { name: 'Apple iPhone 14 Pro 256GB Silver (MQ103)', price: 1399, image: '/imgs/iphone-silver.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '6.3"–6.7"', protection: 'IP68', memory: '256 GB' },
  { name: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3)', price: 398, image: '/imgs/ipad.png', brand: 'Apple', battery: '5000 mAh', screen: 'Retina', diagonal: '6.8"+', protection: 'IP67', memory: '64 GB' },
  { name: 'AirPods Max Silver', price: 549, image: '/imgs/airpods-card.png', brand: 'Apple', battery: '', screen: '', diagonal: '', protection: '', memory: '' },
  { name: 'Apple Watch Series 9 GPS 41mm Starlight', price: 399, image: '/imgs/watch-apple.png', brand: 'Apple', battery: '', screen: 'OLED', diagonal: 'Up to 5.5"', protection: 'IP68', memory: '64 GB' },
  { name: 'Apple MacBook Pro 14" M2', price: 1299, image: '/imgs/macbook.png', brand: 'Apple', battery: '6000+ mAh', screen: 'Retina', diagonal: '6.8"+', protection: '', memory: '512 GB' },
  { name: 'Apple Vision Pro', price: 3499, image: '/imgs/vision-pro.png', brand: 'Apple', battery: '4000 mAh', screen: 'OLED', diagonal: '', protection: '', memory: '256 GB' },
  { name: 'Samsung Galaxy Z Fold5 256GB Phantom Black', price: 1799, image: '/imgs/galaxy-fold.png', brand: 'Samsung', battery: '4000 mAh', screen: 'Super AMOLED', diagonal: '6.8"+', protection: 'IP68', memory: '256 GB' },
  { name: 'Samsung Galaxy Watch6 Classic 47mm Black', price: 369, image: '/imgs/watch-samsung.png', brand: 'Samsung', battery: '', screen: 'AMOLED', diagonal: 'Up to 5.5"', protection: 'IP68', memory: '64 GB' },
  { name: 'Samsung Galaxy Buds FE Graphite', price: 99.99, image: '/imgs/galaxy-buds.png', brand: 'Samsung', battery: '', screen: '', diagonal: '', protection: 'IP67', memory: '' },
  { name: 'Samsung Galaxy Z Fold4 256GB Moss Green', price: 1499, image: '/imgs/galaxy-fold4.png', brand: 'Samsung', battery: '4000 mAh', screen: 'Super AMOLED', diagonal: '6.8"+', protection: 'IP68', memory: '256 GB' },
  { name: 'Apple iPad Pro 12.9" 128GB Wi-Fi Space Gray', price: 1099, image: '/imgs/ipad-pro.png', brand: 'Apple', battery: '6000+ mAh', screen: 'Retina', diagonal: '6.8"+', protection: '', memory: '128 GB' },
  { name: 'Apple Watch SE GPS 44mm Silver', price: 279, image: '/imgs/watch-apple-se.png', brand: 'Apple', battery: '', screen: 'OLED', diagonal: 'Up to 5.5"', protection: 'IP68', memory: '64 GB' },
  { name: 'Huawei FreeBuds 5i Isle Blue', price: 89.99, image: '/imgs/huawei-freebuds.png', brand: 'Huawei', battery: '', screen: '', diagonal: '', protection: '', memory: '' },
]
