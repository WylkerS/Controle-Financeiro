const AccountService = require("../services/AccountService");

class AccountController {
    
    async renderAccountView(req, res) {
        try {
            const accounts = await AccountService.findAll();

            res.render('layout/main', {
                title: 'Contas',
                accounts: accounts,
                pageType: 'account'
            });
        } catch (error) {
            console.error('Erro ao renderizar view de contas:', error.message);
            res.status(500).send('Erro interno: ' + error.message);
        }
    }

    async getAllAccounts(req, res) {
        try {
            const accounts = await AccountService.findAll();
            return res.status(200).json({ data: accounts });
        } catch (error) {
            return res.status(500).json({ error: true, message: error.message });
        }
    }

    async createAccount(req, res) {
        try {
            const { name, initialBalance } = req.body;

            const newAccount = await AccountService.create({ name, initialBalance });

            return res.status(201).json({ message: "Conta criado com sucesso.", data: newAccount });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: true, message: "Já existe uma conta com esse nome." });
            }
            return res.status(400).json({ error: true, message: error.message });
        }
    }
    
    async updateAccount(req, res) {
        try {
            const { id } = req.params;
            const { name, initialBalance } = req.body;

            const updatedAccount = await AccountService.update(id, { name, initialBalance });

            if (!updatedAccount) {
                return res.status(404).json({ error: true, message: "Conta não encontrada." });
            }
            return res.status(200).json({ message: "Atualizado com sucesso.", data: updatedAccount });
        } catch (error) {
            return res.status(400).json({ error: true, message: error.message });
        }
    }

    async deleteAccount(req, res) {
        try {
            const { id } = req.params;
            await AccountService.delete(id);
            return res.status(200).send();
        }
        catch (error) {
            return res.status(500).json({ error: true, message: error.message });
        }
    }
}

module.exports = new AccountController();