import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config/setting';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';
import upload from './middleware/upload';
import { uploadImage } from './controllers/uploadController';

const app: Application = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['POST', 'OPTIONS', 'GET', 'PUT', 'DELETE'],
    }),
);

// Security middleware
// In app.ts
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: [
                    "'self'",
                    `https://${config.aws.bucketName}.s3.amazonaws.com`,
                ],
            },
        },
    }),
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable legacy headers
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message:
                'Too many upload attempts, please try again after 15 minutes',
        });
    },
});

app.use('/upload', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/upload', upload.single('file'), uploadImage);
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Error handling
app.use(errorHandler);

// Start server
const startServer = (): void => {
    try {
        app.listen(config.app.port, () => {
            logger.info(
                `Server running in ${config.app.env} mode on port ${config.app.port}`,
            );
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
