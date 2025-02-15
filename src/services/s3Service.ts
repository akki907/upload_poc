import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from './../config/setting';
import logger from './../utils/logger';

class S3Service {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey
            }
        });
    }

    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        try {
            const uploadParams = {
                Bucket: config.aws.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: 'inline'
            };

            await this.s3Client.send(new PutObjectCommand(uploadParams));

            return `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
        } catch (error) {
            logger.error('S3 upload error:', error);
            throw new Error('Failed to upload file to S3');
        }
    }
}

export default new S3Service();