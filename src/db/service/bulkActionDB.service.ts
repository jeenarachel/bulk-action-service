import { BulkActionStatus } from '../../constants/bulkActionEnum.const';
import { mapToBulkActionResponse } from '../../interfaces/bulk-action-response.interface';
import { BulkAction } from '../models/bulkAction.model';

export const getAllBulkActions = async () => {
    const bulkActions = await BulkAction.find().sort({ createdAt: -1 });
    return bulkActions.map(mapToBulkActionResponse);
};

export const getBulkAction = async (actionId: string) => {
    const bulkAction = await BulkAction.findById(actionId);
    return bulkAction ? mapToBulkActionResponse(bulkAction) : null;
};

export const getBulkActionStatistics = async (actionId: string) => {
    const bulkAction = await BulkAction.findById(actionId);
    if (!bulkAction) return null;

    return {
        actionId: bulkAction._id,
        totalCount: bulkAction.totalCount,
        processedCount: bulkAction.processedCount,
        successCount: bulkAction.successCount,
        failureCount: bulkAction.failureCount,
        skippedCount: bulkAction.skippedCount
    };
};

export const createBulkAction = async (data: any) => {
    const bulkAction = new BulkAction(data);
    return await bulkAction.save();
};

export const getBulkActionStats = async (actionId: string) => {
    return await BulkAction.findById(actionId).select('successCount failureCount skippedCount');
};

export const saveBulkAction = async (data: any) => {
    try {
        const bulkAction = new BulkAction(data);
        return await bulkAction.save();
    } catch (error) {
        console.error('Error saving bulk action:', error);
        throw new Error('Database error while saving bulk action');
    }
};

export const updateBulkActionStatus = async (actionId: any, totalCount: number) => {
    try {
        return await BulkAction.updateOne(
            { _id: actionId },
            { $set: { totalCount, status: BulkActionStatus.PROCESSING } }
        );
    } catch (error) {
        console.error('Error updating bulk action:', error);
        throw new Error('Database error while updating bulk action');
    }
};

export const updateBulkActionProgress = async (actionId: string, processedCount: number, successCount: number) => {
    try {
        await BulkAction.updateOne(
            { _id: actionId },
            { $inc: { processedCount, successCount } }
        );
        const bulkAction = await BulkAction.findOne({ _id: actionId });

        if (!bulkAction) {
            console.error(`Bulk action ${actionId} not found`);
            return;
        }

        if (bulkAction.processedCount >= bulkAction.totalCount) {
            await BulkAction.updateOne({ _id: actionId }, { $set: { status: 'COMPLETED' } });
            console.log(`Bulk action ${actionId} marked as COMPLETED`);
        }
    } catch (error) {
        console.error('Error updating bulk action:', error);
        throw new Error('Database error while updating bulk action');
    }
};