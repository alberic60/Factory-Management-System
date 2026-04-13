import express from 'express';
const router = express.Router();
import controller from '../controllers/orderController.js';

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.post('/', controller.createOrder);
router.put('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);

export default router;