const db = require('../infra/database');

const seedDatabase = async () => {
    try {
        const { Category, Account, Transaction } = db.models;

        // 1. Categorias
        if (await Category.count() === 0) {
            await Category.bulkCreate([
                { name: 'Salário', type: 'INCOME' },
                { name: 'Freelance', type: 'INCOME' },
                { name: 'Aluguel', type: 'EXPENSE' },
                { name: 'Alimentação', type: 'EXPENSE' },
                { name: 'Lazer', type: 'EXPENSE' },
            ]);
}

        // 2. Contas 
        if (await Account.count() === 0) {
            await Account.bulkCreate([
                { name: 'Casa', initialBalance: 0 },
                { name: 'Pessoal', initialBalance: 0 }
            ]);
        }

        // 3. Transações 
        if (await Transaction.count() === 0) {
            if (casa && sal && food) {
                await Transaction.bulkCreate([
                    {
                        accountId: casa.id,
                        categoryId: sal.id,
                        value: 3000.00,
                        date: new Date(),
                        description: 'Salário Mensal',
                        transactionType: 'INCOME',
                        recurrence: 'FIXED'
                    },
                    {
                        accountId: pessoal.id,
                        categoryId: food.id,
                        value: 50.00,
                        date: new Date(),
                        description: 'iFood',
                        transactionType: 'EXPENSE',
                        recurrence: 'VARIABLE'
                    }
                ]);
            }
        }
    } catch (error) {
        console.error('Erro no Seed:', error);
    }
};

module.exports = seedDatabase;