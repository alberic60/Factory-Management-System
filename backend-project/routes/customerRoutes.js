import express from 'express';
const router = express.Router();
import controller from '../controllers/customerController.js';

router.get('/', controller.getCustomers);
router.get('/:id', controller.getCustomerById);
router.post('/', controller.createCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

export default router;