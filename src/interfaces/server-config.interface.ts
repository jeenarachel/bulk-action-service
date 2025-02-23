interface ServerConfig {
    port?: number;
    mongoUri: string;
    csvBatchSize: number;
    kafka: {
        broker: string;
        topic: string;
    }
}

export { ServerConfig };
