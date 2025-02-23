import * as fs from 'fs';
import { parse } from 'fast-csv';
import serverConfig from '../configs/server.config';

const { csvBatchSize } = serverConfig;

export const parseCsvStream = (filePath: string, onBatchReady: (batch: any[]) => Promise<void>): Promise<number> => {
    return new Promise((resolve, reject) => {
        const batchSize = csvBatchSize;
        let rowCount = 0;
        let batch: any[] = [];
        let processing = Promise.resolve();

        fs.createReadStream(filePath)
            .pipe(parse({ headers: true }))
            .on('data', async (row) => {
                rowCount++;
                batch.push(row);

                if (batch.length >= batchSize) {
                    if (batch.length >= batchSize) {
                        const currentBatch = [...batch];
                        batch = [];
                        processing = processing.then(() => onBatchReady(currentBatch));
                    }
                }
            })
            .on('end', async () => {
                if (batch.length > 0) {
                    await onBatchReady(batch);
                }
                resolve(rowCount);
            })
            .on('error', reject);
    });
};
