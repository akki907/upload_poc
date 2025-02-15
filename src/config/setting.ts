import dotenv from 'dotenv';
import path from 'path';
import { Config } from '../types';

dotenv.config({
    path: path.join(
        __dirname,
        `../../.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    ),
});

const config: Config = {
    app: {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        region: process.env.AWS_REGION || '',
        bucketName: process.env.AWS_BUCKET_NAME || '',
    },
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
    },
};

export default config;
