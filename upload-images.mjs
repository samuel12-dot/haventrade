import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

cloudinary.config({
  cloud_name: 'dsqhopa3g',
  api_key:    '743758664184786',
  api_secret: 'KEK9zzJlG80HQeYGtPvuiD25VnE',
});

const IMG_DIR = './client/public/images';

function allImages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...allImages(full));
    } else if (/\.(png|jpe?g|webp)$/i.test(entry) && !entry.startsWith('.')) {
      results.push(full);
    }
  }
  return results;
}

const files = allImages(IMG_DIR);
console.log(`Uploading ${files.length} images…\n`);

let ok = 0, fail = 0;
for (const file of files) {
  // e.g. "images/products/vintage-teak-armchair/vintage-teak-armchair1"
  const rel     = relative('./client/public', file);         // images/products/.../file.png
  const folder  = rel.replace(/\/[^/]+$/, '');              // images/products/...
  const pubId   = rel.replace(/\.[^.]+$/, '');              // strip extension

  try {
    const res = await cloudinary.uploader.upload(file, {
      public_id:       pubId,
      use_filename:    false,
      overwrite:       true,
      resource_type:   'image',
    });
    console.log(`✓  ${pubId}  (${(res.bytes / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (e) {
    console.error(`✗  ${pubId}  →  ${e.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} uploaded, ${fail} failed.`);
