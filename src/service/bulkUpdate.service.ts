import mongoose from 'mongoose';
import { entityCollections } from '../db/models/entityCollections.const';
import { UpdateMessage } from '../interfaces/update-message.interface';
import { updateBulkActionProgress } from '../db/service/bulkActionDB.service';

export const processBulkUpdate = async (message: UpdateMessage) => {
    const { actionId, rows, entityType } = message;
    console.log(`Processing ${rows.length} rows for bulk action ${actionId}`);

    const result = await updateEntitiesBatch(entityType, rows);
    const totalCount = result.upsertedCount + result.modifiedCount;
    await updateBulkActionProgress(actionId, rows.length, totalCount);
    
    console.log(`Completed processing ${rows.length} rows for bulk action ${actionId}`);
};

const updateEntitiesBatch = async (entityType: string, rows: any[]) => {
    const collectionName = entityCollections[entityType];
    if (!collectionName) {
        throw new Error(`Unknown entityType: ${entityType}`);
    }

    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    const bulkOperations = rows.map(row => ({
        updateOne: {
            filter: { id: row.id },
            update: { $set: row },
            upsert: true
        }
    }));

    return collection.bulkWrite(bulkOperations);
};