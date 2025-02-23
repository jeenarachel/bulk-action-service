import { validationMsg } from '../constants/app.const';
import { BulkActionType } from '../constants/bulkActionEnum.const';
import { getAllBulkActions, getBulkAction, getBulkActionStatistics } from '../db/service/bulkActionDB.service';
import { BulkActionRequest } from '../interfaces/bulk-action-request.interface';
import { handleBulkUpload } from '../service/bulkUpload.service';

export const createBulkAction = async (req, res) => {
    try {
        const actionRequest: BulkActionRequest = req.body;
        const { entityType, actionType } = actionRequest;

        if (!entityType || !actionType) {
            return res.status(400).json({ error: validationMsg.REQUIRED_FIELD_ERR });
        }
        console.log('Recieved bulk action request');
        switch (req.body.actionType) {
            case BulkActionType.BULK_UPDATE:
                return await handleBulkUpload(req, res);
            default:
                return res.status(400).json({ error: validationMsg.INVALID_ACTION_TYPE });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: validationMsg.SERVER_ERR });
    }
}

export const getBulkActions = async (req, res) => {
    try {
        const bulkActions = await getAllBulkActions();
        res.json(bulkActions);
    } catch (error) {
        console.error('Error fetching bulk actions:', error);
        res.status(500).json({ error: validationMsg.SERVER_ERR });
    }
};

export const getBulkActionById = async (req, res) => {
    try {
        const { actionId } = req.params;
        const bulkAction = await getBulkAction(actionId);
        if (!bulkAction) {
            return res.status(404).json({ error: 'Bulk action not found' });
        }
        res.json(bulkAction);
    } catch (error) {
        console.error('Error fetching bulk action:', error);
        res.status(500).json({ error: validationMsg.SERVER_ERR });
    }
};

export const getBulkActionStats = async (req, res) => {
    try {
        const { actionId } = req.params;
        const stats = await getBulkActionStatistics(actionId);
        if (!stats) {
            return res.status(404).json({ error: 'Bulk action not found' });
        }
        res.json(stats);
    } catch (error) {
        console.error('Error fetching bulk action stats:', error);
        res.status(500).json({ error: validationMsg.SERVER_ERR });
    }
};
