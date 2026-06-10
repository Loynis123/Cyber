// Static catalog metadata for the products-page sidebar and sort control.
// Mirrors the design; product rows live in the DB.

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

export const filterGroups = [
  { name: 'Battery capacity', prop: 'battery', options: ['3000 mAh', '4000 mAh', '5000 mAh', '6000+ mAh'] },
  { name: 'Screen type', prop: 'screen', options: ['OLED', 'AMOLED', 'Super AMOLED', 'IPS LCD', 'Retina'] },
  { name: 'Screen diagonal', prop: 'diagonal', options: ['Up to 5.5"', '5.6"–6.2"', '6.3"–6.7"', '6.8"+'] },
  { name: 'Protection class', prop: 'protection', options: ['IP67', 'IP68', 'MIL-STD-810'] },
  { name: 'Built-in memory', prop: 'memory', options: ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'] },
]

export const sortOptions = ['By rating', 'Price: low to high', 'Price: high to low', 'Newest first']

export const categories = ['Phones', 'Smart Watches', 'Cameras', 'Headphones', 'Computers', 'Gaming']
