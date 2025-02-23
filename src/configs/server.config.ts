import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { ServerConfig } from '../interfaces/server-config.interface';

dotenv.config();

function initConfig(): ServerConfig {
    const config: ServerConfig = {
      port: _.toNumber(process.env.PORT) || 4000,
      mongoUri: process.env.MONGO_URI,
      csvBatchSize: _.toNumber(process.env.BATCH_SIZE) || 500,
      kafka: {
        broker: process.env.KAFKA_BROKER,
        topic: process.env.KAFKA_TOPIC,
      }
    }
    return config;
}

const serverConfig = initConfig();

export default serverConfig;