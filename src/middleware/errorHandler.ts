import { Request, Response } from 'express';
import { AppError } from './../utils/appError';
import config from './../config/setting';
import { MulterError } from 'multer';
import logger from './../utils/logger';

interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
    error?: Error;
}

const handleMulterError = (err: MulterError): AppError => {

    if (err.code === 'LIMIT_FILE_SIZE') {
        return new AppError('File size too large. Max 5MB allowed.', 400);
    }
    return new AppError('File upload error', 400);
};

const errorHandler = (
    err: Error | AppError | MulterError,
    req: Request,
    res: Response<ErrorResponse>,
): void => {
    const statusCode = (err as AppError).statusCode || 500;
    const status = (err as AppError).status || 'error';

    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode
    });

    if (err instanceof MulterError) {
        err = handleMulterError(err);
    }

    if (config.app.env === 'production') {
        if ((err as AppError).isOperational) {
            res.status(statusCode).json({
                status,
                message: err.message
            });
            return;
        }
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
        return;
    }

    // Development error response
    res.status(statusCode).json({
        status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

export default errorHandler;