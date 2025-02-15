export interface Config {
    app: {
        port: number;
        env: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        bucketName: string;
    };
    upload: {
        maxSize: number;
        allowedMimeTypes: string[];
        allowedExtensions: string[];
    };
}

export interface UploadResponse {
    status: string;
    data: {
        message: string;
        fileUrl: string;
    };
}