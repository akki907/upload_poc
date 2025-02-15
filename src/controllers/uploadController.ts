import { Request, Response, NextFunction } from 'express';
import s3Service from '../services/s3Service';
import logger from '../utils/logger';
import { AppError } from '../utils/appError';
import { sanitizeFilename } from '../utils/security';
import { UploadResponse } from '../types';

export const uploadImage = async (
    req: Request,
    res: Response<UploadResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            throw new AppError('No file uploaded', 400);
        }

        const sanitizedFilename = sanitizeFilename(req.file.originalname);
        const key = `${Date.now()}-${sanitizedFilename}`;

        const fileUrl = await s3Service.uploadFile(req.file, key);

        logger.info(`File uploaded successfully: ${key}`);

        res.status(200).json({
            status: 'success',
            data: {
                message: 'File uploaded successfully',
                fileUrl
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};