const AccountService = require("../services/AccountService");
const TransactionService = require("../services/TransactionService");

class HomeController {
    async renderHome(req, res) {
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

            const accounts = await AccountService.findAll();
            
            const monthTransactions = await TransactionService.findAll({
                startDate: startOfMonth,
                endDate: endOfMonth
            });

            let monthIncome = 0;
            let monthExpense = 0;

            monthTransactions.forEach(t => {
                const val = Number(t.value);
                if (t.transactionType === 'INCOME') {
                    monthIncome += val;
                } else {
                    monthExpense += val;
                }
            });

            const monthlyBalance = monthIncome - monthExpense;

            const prevDate = new Date(currentDate);
            prevDate.setMonth(prevDate.getMonth() - 1);
            const nextDate = new Date(currentDate);
            nextDate.setMonth(nextDate.getMonth() + 1);
            const toStr = (d) => d.toISOString().slice(0, 7);

            res.render('layout/main', {
                title: 'Dashboard',
                pageType: 'home',
                
                monthlyBalance: monthlyBalance, 
                monthIncome: monthIncome,
                monthExpense: monthExpense,
                
                accountsCount: accounts.length,
                recentTransactions: monthTransactions,

                currentDateDisplay: currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                queryDate: toStr(currentDate),
                prevLink: `/?date=${toStr(prevDate)}`,
                nextLink: `/?date=${toStr(nextDate)}`
            });

        } catch (error) {
            console.error('Erro no Dashboard:', error);
            res.status(500).send('Erro no dashboard');
        }
    }
}

module.exports = new HomeController();