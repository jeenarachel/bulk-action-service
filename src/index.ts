import serverConfig from "./configs/server.config";
import app from './server';
import * as http from 'http';
import DatabaseService from "./service/database.service";
import { startBulkUpdateConsumer } from "./service/kafka/consumer.service";

const { port } = serverConfig;

const server = http.createServer(app);

server.listen(port, async () => {
    console.log(`Bulk Action Service lisening on port: ${port}!`);
    await DatabaseService.connect();
    startBulkUpdateConsumer();
});
