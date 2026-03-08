import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicImagesMenuDir = path.join(__dirname, '..', 'public', 'images', 'menu');

// Ensure directory exists
if (!fs.existsSync(publicImagesMenuDir)) {
  fs.mkdirSync(publicImagesMenuDir, { recursive: true });
}

const items = [
  { name: 'margarita.jpg', url: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=1000&auto=format&fit=crop' },
  { name: 'veg-delight-pizza.jpg', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop' },
  { name: 'farm-fresh-pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop' },
  { name: 'mushroom-garlic-twist.jpg', url: 'https://images.unsplash.com/photo-1574126154517-d1e0d89ef734?q=80&w=1000&auto=format&fit=crop' },
  { name: 'tangy-veg-pizza.jpg', url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop' },
  { name: 'paneer-tikka-pizza.jpg', url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1000&auto=format&fit=crop' },
  { name: 'veg-extravaganza-pizza.jpg', url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1000&auto=format&fit=crop' },
  { name: 'paneer-makhani-pizza.jpg', url: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=1000&auto=format&fit=crop' },
  { name: 'roasted-chicken-pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop' },
  { name: 'tandoori-chicken-pizza.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop' },
  { name: 'bbq-chicken-pizza.jpg', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-sausage-pizza.jpg', url: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-makhani-pizza.jpg', url: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-bacon-pizza.jpg', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-peri-peri-pizza.jpg', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop' },
  { name: 'spicy-chicken-tikka-pizza.jpg', url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-garlic-twist.jpg', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop' },
  { name: 'garlic-bread-sticks.jpg', url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=1000&auto=format&fit=crop' },
  { name: 'cheesy-garlic-bread.jpg', url: 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=1000&auto=format&fit=crop' },
  { name: 'chicken-kheema-calzone.jpg', url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop' },
  { name: 'rich-chocolate-brownie.jpg', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop' },
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
          .on('error', reject)
          .once('close', () => resolve(filepath));
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect for Unsplash
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        response.resume();
        reject(new Error(`Request Failed With Status Code: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

const run = async () => {
  console.log(`Downloading ${items.length} images...`);
  for (const item of items) {
    const p = path.join(publicImagesMenuDir, item.name);
    try {
      await downloadImage(item.url, p);
      console.log(`✅ Downloaded ${item.name}`);
    } catch (e) {
      console.error(`❌ Failed to download ${item.name}:`, e.message);
    }
  }
  console.log('Finished downloading images.');
};

run();
