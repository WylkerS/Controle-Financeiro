const AccountService = require("../services/AccountService");
const TransactionService = require("../services/TransactionService");

class HomeController {
    async renderHome(req, res) {
        try {
            const queryDate = req.query.date;
            const selectedAccountId = req.query.accountId || ''; 

            let currentDate;
            if (queryDate) currentDate = new Date(queryDate + '-01T12:00:00');
            else currentDate = new Date();

            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const accounts = await AccountService.findAll();
            
            const monthTransactions = await TransactionService.findAll({
                startDate: startOfMonth,
                endDate: endOfMonth,
                accountId: selectedAccountId 
            });

            const transactionsUntilMonthEnd = await TransactionService.findAllRaw(endOfMonth, selectedAccountId);

            let totalInitial = 0;
            if (selectedAccountId) {
                const selectedAccount = accounts.find(a => a.id == selectedAccountId);
                if (selectedAccount) totalInitial = Number(selectedAccount.initialBalance);
            } else {
                totalInitial = accounts.reduce((acc, account) => acc + Number(account.initialBalance), 0);
            }
            
            const accumulatedIncome = transactionsUntilMonthEnd
                .filter(t => t.transactionType === 'INCOME')
                .reduce((sum, t) => sum + t.value, 0);
                
            const accumulatedExpense = transactionsUntilMonthEnd
                .filter(t => t.transactionType === 'EXPENSE')
                .reduce((sum, t) => sum + t.value, 0);

            const balanceAtMonthEnd = totalInitial + accumulatedIncome - accumulatedExpense;

            let monthIncome = 0;
            let monthExpense = 0;
            monthTransactions.forEach(t => {
                if (t.transactionType === 'INCOME') monthIncome += t.value;
                else monthExpense += t.value;
            });
            const monthlyBalance = monthIncome - monthExpense;

            const prevDate = new Date(currentDate); prevDate.setMonth(prevDate.getMonth() - 1);
            const nextDate = new Date(currentDate); nextDate.setMonth(nextDate.getMonth() + 1);
            const toStr = (d) => d.toISOString().slice(0, 7);

            const accountQuery = selectedAccountId ? `&accountId=${selectedAccountId}` : '';

            res.render('layout/main', {
                title: 'Dashboard',
                pageType: 'home',
                
                totalBalance: balanceAtMonthEnd,
                monthIncome: monthIncome,
                monthExpense: monthExpense,
                monthlyBalance: monthlyBalance,
                
                accountsCount: accounts.length,
                accounts: accounts, 
                selectedAccountId: selectedAccountId, 
                recentTransactions: monthTransactions,

                currentDateDisplay: currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                queryDate: toStr(currentDate),
                prevLink: `/?date=${toStr(prevDate)}${accountQuery}`,
                nextLink: `/?date=${toStr(nextDate)}${accountQuery}`
            });

        } catch (error) {
            console.error('Erro no Dashboard:', error);
            res.status(500).send('Erro no dashboard');
        }
    }
}

module.exports = new HomeController();