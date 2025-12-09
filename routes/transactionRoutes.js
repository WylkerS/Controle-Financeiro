const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.get('/view', TransactionController.renderTransactionView);
router.post('/', TransactionController.createTransaction);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;