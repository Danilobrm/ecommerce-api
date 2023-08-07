import { resolve } from 'path';
import fs from 'fs';

export function getDestinationFolder(folder: string, folderName: string) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  const destination = resolve(
    __dirname,
    '..',
    '..',
    `./${folder}/${folderName}`,
  );

  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  return destination;
}
