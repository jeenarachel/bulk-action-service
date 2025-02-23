import mongoose from 'mongoose';
import { BulkActionStatus, BulkActionType } from '../../constants/bulkActionEnum.const';

const bulkActionSchema = new mongoose.Schema({
    actionType: { type: String, enum: Object.values(BulkActionType), required: true },
    entityType: { type: String, required: true },
    status: { type: String, enum: Object.values(BulkActionStatus), default: BulkActionStatus.QUEUED },
    filePath: { type: String, required: true },
    totalCount: { type: Number, required: true },
    processedCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export const BulkAction = mongoose.model('bulk_actions', bulkActionSchema);
