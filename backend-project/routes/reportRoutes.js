import express from 'express';
const router = express.Router();
import reportController from '../controllers/reportController.js';

router.get("/daily-sales", reportController.dailySalesReport);

export default router;