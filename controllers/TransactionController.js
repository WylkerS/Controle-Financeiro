const TransactionService = require("../services/TransactionService");
const AccountService = require("../services/AccountService");
const CategoryService = require("../services/CategoryService");

class TransactionController {
    
    async renderTransactionView(req, res) {
        try {
            const queryDate = req.query.date;
            let currentDate;

            if (queryDate) {
                currentDate = new Date(queryDate + '-01T12:00:00');
            } else {
                currentDate = new Date();
            }

            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const transactions = await TransactionService.findAll({
                startDate: startOfMonth,
                endDate: endOfMonth
            });
            
            const accounts = await AccountService.findAll();
            const categories = await CategoryService.findAll();

            const prevDate = new Date(currentDate);
            prevDate.setMonth(prevDate.getMonth() - 1);
            const nextDate = new Date(currentDate);
            nextDate.setMonth(nextDate.getMonth() + 1);
            
            const toStr = (d) => d.toISOString().slice(0, 7);

            res.render('layout/main', {
                title: 'Transações',
                pageType: 'transaction',
                transactions: transactions,
                accounts: accounts,
                categories: categories,
                
                currentDateDisplay: currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                queryDate: toStr(currentDate),
                prevLink: `/transactions/view?date=${toStr(prevDate)}`,
                nextLink: `/transactions/view?date=${toStr(nextDate)}`
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar transações.");
        }
    }

    async createTransaction(req, res) {
        try {
            await TransactionService.create(req.body);
            return res.status(201).json({ message: "Transação salva com sucesso." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async updateTransaction(req, res) {
        try {
            await TransactionService.update(req.params.id, req.body);
            return res.status(200).json({ message: "Transação atualizada." });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteTransaction(req, res) {
        try {
            await TransactionService.delete(req.params.id);
            return res.status(200).send();
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TransactionController();