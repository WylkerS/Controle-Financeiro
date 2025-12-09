const TransactionService = require("../services/TransactionService");
const AccountService = require("../services/AccountService");
const CategoryService = require("../services/CategoryService");

class TransactionController {
    
    async renderTransactionView(req, res) {
        try {
            // 1. Captura Filtros da URL
            const queryDate = req.query.date;
            const selectedAccountId = req.query.accountId || '';
            const selectedCategoryId = req.query.categoryId || ''; // NOVO
            const selectedSortBy = req.query.sortBy || '';         // NOVO

            // 2. Define Data
            let currentDate;
            if (queryDate) currentDate = new Date(queryDate + '-01T12:00:00');
            else currentDate = new Date();

            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            // 3. Buscas
            const transactions = await TransactionService.findAll({
                startDate: startOfMonth,
                endDate: endOfMonth,
                accountId: selectedAccountId,
                categoryId: selectedCategoryId, // Passa p/ Service
                sortBy: selectedSortBy          // Passa p/ Service
            });
            
            const accounts = await AccountService.findAll();
            const categories = await CategoryService.findAll();

            // 4. Construção da URL de Navegação (Para manter filtros ao trocar de mês)
            const prevDate = new Date(currentDate); prevDate.setMonth(prevDate.getMonth() - 1);
            const nextDate = new Date(currentDate); nextDate.setMonth(nextDate.getMonth() + 1);
            const toStr = (d) => d.toISOString().slice(0, 7);

            // Monta a string de parâmetros extras (Conta, Categoria, Ordem)
            let queryParams = '';
            if (selectedAccountId) queryParams += `&accountId=${selectedAccountId}`;
            if (selectedCategoryId) queryParams += `&categoryId=${selectedCategoryId}`;
            if (selectedSortBy) queryParams += `&sortBy=${selectedSortBy}`;

            res.render('layout/main', {
                title: 'Transações',
                pageType: 'transaction',
                transactions: transactions,
                accounts: accounts,
                categories: categories,
                
                // Envia dados para manter os selects preenchidos
                selectedAccountId: selectedAccountId,
                selectedCategoryId: selectedCategoryId,
                selectedSortBy: selectedSortBy,
                
                currentDateDisplay: currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                queryDate: toStr(currentDate),
                
                // Links preservam os filtros
                prevLink: `/transactions/view?date=${toStr(prevDate)}${queryParams}`,
                nextLink: `/transactions/view?date=${toStr(nextDate)}${queryParams}`
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao carregar transações.");
        }
    }

    // ... create, update, delete (Mantém iguais) ...
    async createTransaction(req, res) {
        try { await TransactionService.create(req.body); return res.status(201).json({ message: "Salvo." }); } 
        catch (error) { return res.status(400).json({ message: error.message }); }
    }
    async updateTransaction(req, res) {
        try { await TransactionService.update(req.params.id, req.body); return res.status(200).json({ message: "Atualizado." }); } 
        catch (error) { return res.status(400).json({ message: error.message }); }
    }
    async deleteTransaction(req, res) {
        try { await TransactionService.delete(req.params.id); return res.status(200).send(); } 
        catch (error) { return res.status(500).json({ message: error.message }); }
    }
}

module.exports = new TransactionController();