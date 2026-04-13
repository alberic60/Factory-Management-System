import express from 'express';
const router = express.Router();
import controller from '../controllers/paymentController.js';

router.get('/', controller.getPayments);
router.get('/:id', controller.getPaymentById);
router.post('/', controller.createPayment);
router.put('/:id', controller.updatePayment);
router.delete('/:id', controller.deletePayment);

export default router;
