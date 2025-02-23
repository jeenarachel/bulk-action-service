import { Router } from "express";
import { createBulkAction, getBulkActionById, getBulkActions, getBulkActionStats } from "../controller/bulkAction.controller";
import { csvHandler } from "../middleware/csvHandler.middleware";

const routes: Router = Router();

routes.get('/health', (req, res) => {
    res.status(200).json({ status: 'up' });
});
routes.get('/bulk-actions', getBulkActions);
routes.get('/bulk-actions/:actionId', getBulkActionById);
routes.get('/bulk-actions/:actionId/stats', getBulkActionStats);
routes.post('/bulk-actions', csvHandler.single('file'), createBulkAction);

export default routes;