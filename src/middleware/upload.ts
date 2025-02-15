import multer from 'multer';
import path from 'path';
import { AppError } from './../utils/appError';
import { Request } from 'express';
import config from './../config/setting';

const storage = multer.memoryStorage();

const fileFilter = (
    _: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {
    console.log({ file });
    const ext = path.extname(file.originalname).toLowerCase();

    if (!config.upload.allowedMimeTypes.includes(file.mimetype) ||
        !config.upload.allowedExtensions.includes(ext)) {
        return cb(new AppError('Invalid file type. Only JPEG, PNG and GIF allowed.', 400));
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: config.upload.maxSize
    },
    fileFilter
});

export default upload;