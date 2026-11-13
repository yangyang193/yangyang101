import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rawDir = path.join(root, 'assets/products/raw');
const outDir = path.join(root, 'assets/products/display');
const dataPath = path.join(root, 'data/products.json');

const MAX_EDGE = 860;
const JPEG_QUALITY = 82;

await fs.mkdir(outDir, { recursive: true });

const pngFiles = (await fs.readdir(rawDir)).filter((f) => /\.png$/i.test(f));
let totalIn = 0;
let totalOut = 0;

for (const file of pngFiles) {
  const input = path.join(rawDir, file);
  const outputName = file.replace(/\.png$/i, '.jpg');
  const output = path.join(outDir, outputName);
  const inputStat = await fs.stat(input);
  totalIn += inputStat.size;

  await sharp(input)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(output);

  const outStat = await fs.stat(output);
  totalOut += outStat.size;
}

const coverPath = path.join(root, 'assets/cover.jpg');
if (await fs.stat(coverPath).catch(() => null)) {
  const coverTmp = path.join(root, 'assets/cover.opt.jpg');
  await sharp(coverPath)
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(coverTmp);
  await fs.rename(coverTmp, coverPath);
}

const json = JSON.parse(await fs.readFile(dataPath, 'utf8'));
for (const cat of json.categories) {
  for (const item of cat.items) {
    item.image = item.image.replace(/\.png$/i, '.jpg');
  }
}
await fs.writeFile(dataPath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

console.log(
  `Optimized ${pngFiles.length} product images: ${(totalIn / 1024 / 1024).toFixed(2)} MB → ${(totalOut / 1024 / 1024).toFixed(2)} MB`,
);
