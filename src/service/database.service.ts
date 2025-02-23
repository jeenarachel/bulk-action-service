import mongoose from 'mongoose';
import serverConfig from '../configs/server.config';

export class DatabaseService {
    private static instance: DatabaseService;
    private connection: mongoose.Connection | null = null;

    private constructor() {}

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async connect(): Promise<void> {
        if (this.connection) {
            console.log('Database already connected');
            return;
        }

        try {
            await mongoose.connect(serverConfig.mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            } as mongoose.ConnectOptions);
            
            this.connection = mongoose.connection;
            console.log('Database Connected!');
        } catch (error) {
            console.error('Database Connection failed:', error);
            process.exit(1);
        }
    }
}

export default DatabaseService.getInstance();
