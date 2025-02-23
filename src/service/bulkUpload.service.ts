import serverConfig from "../configs/server.config";
import { validationMsg } from "../constants/app.const";
import { BulkActionStatus, BulkActionType } from "../constants/bulkActionEnum.const";
import { saveBulkAction, updateBulkActionStatus } from "../db/service/bulkActionDB.service";
import { UpdateRequest } from "../interfaces/bulk-action-request.interface";
import { parseCsvStream } from "../utils/csvParser";
import { sendToKafka } from "./kafka/producer.service";

const { topic } = serverConfig.kafka;

export const handleBulkUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: validationMsg.REQUIRED_CSV_ERR });
    }
    console.log('Recieved bulk update request');

    const actionRequest: UpdateRequest = req.body;
    const { entityType } = actionRequest;
    const filePath = req.file.path;

    const { _id: actionId } = await saveBulkActionToDb(entityType, filePath);
    console.log('Saved bulk upload requests to database with id - ', actionId);
    
    uploadChunksToKafka(filePath, entityType, actionId)
        .then((totalCount: number) => updateBulkActionStatus(actionId, totalCount));
    
    res.status(201).json({
        actionId,
        status: BulkActionStatus.QUEUED,
        message: 'Bulk action saved successfully.'
    });
};

const saveBulkActionToDb = async (entityType: string, filePath: string) => {
    const bulkActionData = {
            actionType: BulkActionType.BULK_UPDATE,
            entityType,
            filePath,
            totalCount: 0
    };
    return await saveBulkAction(bulkActionData);
}

const uploadChunksToKafka = async (filePath: string, entityType: string, actionId) => {
    return parseCsvStream(filePath, async (batch) => {
        await sendToKafka(topic, { actionId: actionId, rows: batch, entityType }).then(() => console.log(`Sent ${batch.length} rows for bulk action ${actionId}`));
    });
}