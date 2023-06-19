import crypto from 'crypto';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { getFolderName } from '../middlewares/getImagesFolderName';
import { getDestinationFolder } from './getDestinationFolder';

export default {
  upload(folder: string) {
    return {
      storage: multer.diskStorage({
        destination: async (req, file, callback) => {
          const { category_id } = req.body;
          const folderName = await getFolderName(category_id);

          const destination = getDestinationFolder(folder, folderName);

          callback(null, destination);
        },
        filename: (req, file, callback) => {
          const fileHash = crypto.randomBytes(16).toString('hex');
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
      fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: FileFilterCallback,
      ) => {
        if (
          file.mimetype == 'image/png' ||
          file.mimetype == 'image/jpg' ||
          file.mimetype == 'image/jpeg'
        ) {
          return callback(null, true);
        }

        callback(null, false);
        return callback(new Error('Only .png, .jpg and .jpeg format allowed!'));
      },
    };
  },
};
