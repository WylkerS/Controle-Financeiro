const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');

router.get('/view', AccountController.renderAccountView);

router.get('/', AccountController.getAllAccounts);

router.post('/', AccountController.createAccount);

router.put('/:id', AccountController.updateAccount);

router.delete('/:id', AccountController.deleteAccount);

module.exports = router;